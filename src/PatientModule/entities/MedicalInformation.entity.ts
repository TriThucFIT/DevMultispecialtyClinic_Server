import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';

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
  @JoinColumn({
    name: 'patient_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Patient, (patient) => patient.id)
  patient: Patient;
}
