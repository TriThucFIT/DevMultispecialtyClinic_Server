import { InjectRepository } from '@nestjs/typeorm';
import { MedicalRecord } from '../entities/MedicalRecord.entity';
import { Repository } from 'typeorm';
import {
  MedicalRecordCreation,
  MedicalRecordEntryCreation,
  MedicalRecordEntryUpdate,
} from '../dto/patient.dto';
import { PatientService } from './patient.service';
import { NotFoundException } from '@nestjs/common';
import { MedicalRecordEntry } from '../entities/MedicalRecordEntry.entity';
import { DoctorService } from 'src/DoctorModule/doctor.service';
import { error } from 'console';
import { MedicalRecordEntryStatus } from '../enums/MedicalRecordEntryStatus.enum';

export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(MedicalRecordEntry)
    private medicalRecordEntryRepository: Repository<MedicalRecordEntry>,
    private patientService: PatientService,
    private doctorService: DoctorService,
  ) {}

  async findByPatientId(patientId: string) {
    return this.medicalRecordRepository.findOne({
      where: { patient: { patientId } },
      relations: [
        'patient',
        'entries',
        'entries.doctor',
        'entries.medicalInformation',
        'entries.labRequests',
        'entries.labRequests.labTest',
        'entries.labRequests.testResult',
        'entries.prescriptions.medications',
        'entries.prescriptions.medications.medication',
        'entries.appointment',
      ],
    });
  }

  async findOne(id: number) {
    return this.medicalRecordRepository.findOne({
      where: { id },
      relations: [
        'patient',
        'entries',
        'entries.doctor',
        'entries.medicalInformation',
        'entries.labRequests',
        'entries.labRequests.labTest',
        'entries.labRequests.testResult',
        'entries.prescriptions.medications',
        'entries.appointment',
      ],
    });
  }
  async createMedicalRecord(recorddto: MedicalRecordCreation) {
    try {
      let patient =
        typeof recorddto.patient === 'string'
          ? await this.patientService.findOne(recorddto.patient)
          : recorddto.patient;
      if (!patient) {
        throw new NotFoundException('Không tìm thấy bệnh nhân');
      }
      const medicalRecord = new MedicalRecord();
      medicalRecord.patient = patient;
      medicalRecord.notes = recorddto.notes;
      return this.medicalRecordRepository.save(medicalRecord);
    } catch (e) {
      error(e);
      throw e;
    }
  }

  async createRecordEntry(record: MedicalRecordEntryCreation) {
    try {
      let recordEntry = new MedicalRecordEntry();
      if (record.doctorId) {
        recordEntry.doctor = await this.doctorService.findByEmployeeId(
          record.doctorId,
        );
      }
      recordEntry.invoice = record.invoice;
      recordEntry.symptoms = record.symptoms;
      recordEntry.visitDate = new Date();
      recordEntry.medicalRecord =
        typeof record.record === 'number'
          ? await this.findOne(record.record)
          : record.record;

      const new_entry =
        await this.medicalRecordEntryRepository.save(recordEntry);
      await this.medicalRecordRepository.save({
        ...new_entry.medicalRecord,
        entries: new_entry.medicalRecord?.entries?.concat(new_entry) || [
          new_entry,
        ],
      });
      return new_entry;
    } catch (e) {
      error(e);
      throw e;
    }
  }

  async findRecordEntry(id: number) {
    return this.medicalRecordEntryRepository.findOne({
      where: { id },
      relations: [
        'doctor',
        'invoice',
        'invoice.invoiceItems',
        'labRequests',
        'labRequests.labTest',
        'labRequests.testResult',
      ],
    });
  }

  async addRecordEntryToRecord(
    recordId: number,
    entry: MedicalRecordEntryCreation,
  ) {
    try {
      let record = await this.findOne(recordId);
      if (!record) {
        throw new NotFoundException('Không tìm thấy hồ sơ bệnh án');
      }
      let recordEntry = new MedicalRecordEntry();
      recordEntry.medicalRecord = record;
      recordEntry.symptoms = entry.symptoms;
      recordEntry.visitDate = new Date();
      recordEntry.doctor = entry.doctorId
        ? await this.doctorService.findByEmployeeId(entry.doctorId)
        : null;
      const newEntry =
        await this.medicalRecordEntryRepository.save(recordEntry);
      record.entries = record.entries?.concat(newEntry) || [newEntry];
      await this.medicalRecordRepository.save(record);
      return newEntry;
    } catch (e) {
      error(e);
      throw e;
    }
  }

  async saveRecordEntry(recordEntry: MedicalRecordEntry) {
    return this.medicalRecordEntryRepository.save(recordEntry);
  }

  async updateRecordEntry(entry: MedicalRecordEntryUpdate) {
    try {
      const medicalRecordEntry = await this.findRecordEntry(
        entry.medicalRecordEntryId,
      );
      if (!medicalRecordEntry) {
        throw new NotFoundException('Không tìm thấy hồ sơ bệnh án');
      }
      medicalRecordEntry.diagnosis = entry.diagnosis;
      medicalRecordEntry.treatmentPlan = entry.treatmentPlan;
      medicalRecordEntry.note = entry.additionalNote;
      medicalRecordEntry.status = MedicalRecordEntryStatus.COMPLETED;
      return this.medicalRecordEntryRepository.save(medicalRecordEntry);
    } catch (error) {
      throw error;
    }
  }
}
