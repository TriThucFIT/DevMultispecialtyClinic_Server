import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('specialization')
export class Specialization extends BaseEntity {
  @Column({ primary: true })
  specialization_id: string;
  @Column()
  name: string;
  @OneToMany(() => Doctor, (doctor) => doctor.specialization)
  doctors: Doctor[];
}
