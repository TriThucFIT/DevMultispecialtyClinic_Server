import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MedicalRecordEntry } from './MedicalRecordEntry.entity';
import { Patient } from './patient.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';

@Entity('medical_record')
export class MedicalRecord extends BaseClassProperties {

  @ManyToOne(() => Patient, (patient) => patient.id)
  @JoinColumn({
    name: 'patient_id',
    referencedColumnName: 'id',
  })
  patient: Patient;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => MedicalRecordEntry, (entry) => entry.medicalRecord, {
    cascade: true,
  })
  entries: MedicalRecordEntry[];
}
