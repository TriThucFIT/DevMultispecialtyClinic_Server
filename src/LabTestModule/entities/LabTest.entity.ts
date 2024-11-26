import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Doctor } from 'src/DoctorModule/entities/doctor.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LabTestCategory } from './LabTestCategory.entity';

@Entity('lab_test')
export class LabTest extends BaseClassProperties {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.id)
  @JoinColumn({
    name: 'doctor_id',
    referencedColumnName: 'id',
  })
  doctor: Doctor;

  @ManyToOne(() => LabTestCategory, (category) => category.id)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  category: LabTestCategory;
}
