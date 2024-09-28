import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Patient } from './patient.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('feedback')
export class Feedback extends BaseClassProperties {
  @Column({
    length: 1000,
  })
  content: string;
  @Column({
    length: 20,
  })
  serviceType: string;
  @JoinColumn({
    name: 'patient_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Patient, (patient) => patient.id)
  patient: Patient;
  @Column()
  submitedDate: Date;
}
