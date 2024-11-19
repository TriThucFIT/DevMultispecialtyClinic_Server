import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class LabTest extends BaseClassProperties {
  @Column({
    length: 100,
  })
  name: string;
  @Column({
    nullable: false,
    default: 0,
  })
  price: number;
  @JoinColumn({
    name: 'doctor_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Doctor, (doctor) => doctor.id)
  doctor: Doctor;
}
