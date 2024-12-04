import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { LabRequest } from 'src/LabTestModule/entities/LabRequest.entity';
import { MedicalRecord } from './MedicalRecord.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Doctor } from 'src/DoctorModule/entities/doctor.entity';
import { MedicalInformation } from './MedicalInformation.entity';
import { MedicalRecordEntryStatus } from '../enums/MedicalRecordEntryStatus.enum';
import { Invoice } from 'src/CasherModule/entities/invoice.entity';
import { Prescription } from 'src/PharmacistModule/entities/prescription.entity';
import { Appointment } from 'src/AppointmentModule/entities/appointment.entity';

@Entity('medical_record_entry')
export class MedicalRecordEntry extends BaseClassProperties {
  @Column({
    type: 'enum',
    enum: MedicalRecordEntryStatus,
    default: MedicalRecordEntryStatus.IN_PROGRESS,
  })
  status: MedicalRecordEntryStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  visitDate: Date;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  treatmentPlan: string;

  @OneToOne(() => MedicalInformation, (info) => info.medicalRecordEntry, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'medical_information_id',
    referencedColumnName: 'id',
  })
  medicalInformation: MedicalInformation;

  @ManyToOne(() => MedicalRecord, (record) => record.entries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'record_id',
    referencedColumnName: 'id',
  })
  medicalRecord: MedicalRecord;

  @ManyToOne(() => Doctor, (doctor) => doctor.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'doctor_id',
    referencedColumnName: 'id',
  })
  doctor: Doctor;

  @OneToMany(() => LabRequest, (request) => request.medicalRecordEntry, {
    cascade: true,
  })
  labRequests: LabRequest[];

  @OneToMany(
    () => Prescription,
    (prescription) => prescription.medicalRecordEntry,
    {
      cascade: true,
    },
  )
  prescriptions: Prescription[];

  @OneToOne(() => Invoice, (invoice) => invoice.medicalRecordEntry, {
    cascade: true,
    nullable: true,
  })
  invoice: Invoice;

  @OneToOne(() => Appointment, (apoointment) => apoointment.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'appointment_id',
    referencedColumnName: 'id',
  })
  appointment: Appointment;
}
