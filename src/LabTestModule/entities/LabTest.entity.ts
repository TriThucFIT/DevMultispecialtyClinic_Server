import { BaseClassProperties } from 'src/Common/BaseClassProperties';
<<<<<<< HEAD:src/labTest/entities/LabTest.entity.ts
import { Doctor } from 'src/doctor/entities/doctor.entity';
=======
import { Doctor } from 'src/DoctorModule/entities/doctor.entity';
>>>>>>> 2ed803faf176af1a2b6ef2f3117e0ff22b1c3a92:src/LabTestModule/entities/LabTest.entity.ts
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
