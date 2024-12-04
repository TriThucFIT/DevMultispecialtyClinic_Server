import { InjectRepository } from '@nestjs/typeorm';
import { Medication } from '../entities/Medication.entity';
import { Like, Repository } from 'typeorm';
import {
  MedicationCreateDto,
  MedicationResponseDto,
  PrescriptionDto,
  PrescriptionMedicationDto,
  PrescriptionResponseDto,
} from '../types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrescriptionMedication } from '../entities/prescriptionMedication.entity';
import { Prescription } from '../entities/prescription.entity';
import { PrescriptionStatus } from '../enums';
import { InvoiceService } from 'src/CasherModule/services/Invoice.service';
import { ItemType } from 'src/CasherModule/enums/itemType.enum';
import { MedicalRecordService } from 'src/PatientModule/services/MedicalRecod.service';
import { DoctorService } from 'src/DoctorModule/doctor.service';

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
}
