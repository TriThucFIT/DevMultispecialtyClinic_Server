import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Column, Entity } from 'typeorm';

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
}
