import { InjectRepository } from '@nestjs/typeorm';
import { Medication } from '../entities/Medication.entity';
import { Like, Repository } from 'typeorm';
import {
  MedicationCreateDto,
  MedicationResponseDto,
  PrescriptionDto,
  PrescriptionMedicationDto,
  PrescriptionResponseDto,
  PrescriptionUpdateDto,
} from '../types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrescriptionMedication } from '../entities/prescriptionMedication.entity';
import { Prescription } from '../entities/prescription.entity';
import { PrescriptionStatus } from '../enums';
import { InvoiceService } from 'src/CasherModule/services/Invoice.service';
import { ItemType } from 'src/CasherModule/enums/itemType.enum';
import { MedicalRecordService } from 'src/PatientModule/services/MedicalRecod.service';
import { DoctorService } from 'src/DoctorModule/doctor.service';
import { CustomMailerService } from 'src/MailerModule/MailerModule.service';
import { MedicalRecordSumary, MedicationToMail } from 'src/MailerModule/types';
import { MedicalRecordEntry } from 'src/PatientModule/entities/MedicalRecordEntry.entity';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
    @InjectRepository(PrescriptionMedication)
    private readonly prescriptionMedicationRepository: Repository<PrescriptionMedication>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    private readonly invoiceService: InvoiceService,
    private readonly medicalRecordService: MedicalRecordService,
    private readonly doctorService: DoctorService,
    private readonly mailService: CustomMailerService,
  ) {}

  async createMedication(
    medication: MedicationCreateDto,
  ): Promise<MedicationResponseDto> {
    return await this.medicationRepository.save(medication);
  }
  async createMedications(
    medications: MedicationCreateDto[],
  ): Promise<MedicationResponseDto[]> {
    return await this.medicationRepository.save(medications);
  }

  async getMedicationById(id: number): Promise<MedicationResponseDto> {
    return await this.medicationRepository.findOne({
      where: { id },
    });
  }

  async getMedicationByName(name: string): Promise<MedicationResponseDto[]> {
    return await this.medicationRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async getMedications(): Promise<MedicationResponseDto[]> {
    return await this.medicationRepository.find();
  }

  async createPrescription(
    prescription: PrescriptionDto,
  ): Promise<PrescriptionResponseDto> {
    let medicalRecordEntry = await this.medicalRecordService.findRecordEntry(
      prescription.medicalRecordId,
    );

    if (!medicalRecordEntry) {
      throw new NotFoundException('Không tìm thấy hồ sơ bệnh án');
    }
    if (!medicalRecordEntry.doctor) {
      const doctor = await this.doctorService.findByEmployeeId(
        prescription.doctorId,
      );
      if (!doctor) {
        throw new NotFoundException('Không tìm thấy bác sĩ');
      }
      medicalRecordEntry.doctor = doctor;
      await this.medicalRecordService.saveRecordEntry(medicalRecordEntry);
    }

    let pres = this.prescriptionRepository.create();
    pres.note = prescription.note;
    pres.status = PrescriptionStatus.PENDING;
    pres.medicalRecordEntry = medicalRecordEntry;
    pres = await this.prescriptionRepository.save(pres);
    const prescriptionMedications = prescription.medications.map(
      async (medication) => {
        const prescriptionMedication = new PrescriptionMedication();
        prescriptionMedication.medication =
          await this.medicationRepository.findOne({
            where: { id: medication.medicationId },
          });

        if (!prescriptionMedication.medication) {
          throw new NotFoundException(
            `Thuốc ${medication.medicationId} không tồn tại`,
          );
        }
        prescriptionMedication.quantity = medication.quantity;
        prescriptionMedication.note = medication.note;
        prescriptionMedication.prescription = pres;
        return this.prescriptionMedicationRepository.save(
          prescriptionMedication,
        );
      },
    );
    pres.medications = await Promise.all(prescriptionMedications);

    await this.invoiceService.addInvoiceItem({
      invoice_id: medicalRecordEntry.invoice.id,
      items: [
        {
          name: 'Đơn thuốc',
          amount: pres.medications.reduce(
            (acc, cur) => acc + cur.medication.unitPrice * cur.quantity,
            0,
          ),
          itemType: ItemType.PRESCRIPTION,
        },
      ],
    });
    return pres;
  }

  async getPrescriptionById(id: number): Promise<PrescriptionResponseDto> {
    return await this.prescriptionRepository.findOne({
      where: { id },
      relations: ['medications', 'medications.medication'],
    });
  }

  async getPrescriptions(): Promise<PrescriptionResponseDto[]> {
    return await this.prescriptionRepository.find({
      relations: ['medications', 'medications.medication'],
    });
  }

  async updatePrescriptionStatus(
    prescriptions: PrescriptionUpdateDto[],
  ): Promise<PrescriptionResponseDto[]> {
    let medicalRecordEntry: MedicalRecordEntry | null = null;
    let presToMail: MedicationToMail[] = [];
    const updatedPrescriptions = prescriptions.map(async (prescription) => {
      const pres = await this.prescriptionRepository.findOne({
        where: { id: prescription.id },
        relations: [
          'medications',
          'medications.medication',
          'medicalRecordEntry.doctor',
          'medicalRecordEntry.labRequests.labTest',
          'medicalRecordEntry.labRequests.testResult',
          'medicalRecordEntry.medicalRecord.patient.account',
        ],
      });
      if (!pres) {
        throw new NotFoundException('Không tìm thấy đơn thuốc');
      }

      if (pres.medicalRecordEntry) {
        medicalRecordEntry = pres.medicalRecordEntry;
      }
      pres.status = prescription.status;
      pres.medications.forEach((med) => {
        presToMail.push({
          name: med.medication.name,
          dosage: med.medication.dosage,
          unitStock: med.medication.unitStock,
          quantity: med.quantity,
          usage: med.medication.usage,
          note: med.note,
        });
      });
      return this.prescriptionRepository.save(pres);
    });
    const resultUpdate = await Promise.all(updatedPrescriptions);
    if (resultUpdate && medicalRecordEntry) {
      const toMail = medicalRecordEntry?.medicalRecord?.patient?.account?.email;
      if (toMail) {
        const recordSumary: MedicalRecordSumary = {
          diagnosis: medicalRecordEntry.diagnosis,
          note: medicalRecordEntry.note,
          symptoms: medicalRecordEntry.symptoms,
          treatmentPlan: medicalRecordEntry.treatmentPlan,
          visitDate: medicalRecordEntry.visitDate
            ? new Date(medicalRecordEntry.visitDate).toLocaleDateString('vi-VN')
            : '',
          prescriptions: presToMail,
          totalAmountPrescriptions: this.mailService.formatCurrency(
            resultUpdate.reduce(
              (acc, cur) =>
                acc +
                cur.medications.reduce(
                  (acc, cur) => acc + cur.medication.unitPrice * cur.quantity,
                  0,
                ),
              0,
            ),
          ),
          labRequests: medicalRecordEntry?.labRequests?.map((lab) => ({
            name: lab.labTest.name,
            result: lab.testResult.result,
            price: this.mailService.formatCurrency(lab.labTest.price),
            notes: lab.testResult.notes,
          })),
          totalAmountLabTests: this.mailService.formatCurrency(
            medicalRecordEntry?.labRequests?.reduce(
              (acc, cur) => acc + cur.labTest.price,
              0,
            ),
          ),
          doctorName: medicalRecordEntry?.doctor?.fullName,
          doctorPhone: medicalRecordEntry?.doctor?.phone,
        };
        await this.mailService.sendMedicalSummary(toMail, recordSumary);
      }
    }
    return resultUpdate;
  }


}
