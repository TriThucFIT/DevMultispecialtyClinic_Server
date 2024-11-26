import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Column, Entity, OneToOne } from 'typeorm';
import { MedicalRecordEntry } from './MedicalRecordEntry.entity';

@Entity('medical_information')
export class MedicalInformation extends BaseClassProperties {
  @Column()
  date: Date;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  bloodPressure: string;

  @Column({ nullable: true })
  heartRate: number;

  @Column({ nullable: true })
  temperature: number;

  @OneToOne(() => MedicalRecordEntry, (entry) => entry.medicalInformation, {
    onDelete: 'CASCADE',
  })
  medicalRecordEntry: MedicalRecordEntry;
}
