import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Column, OneToMany } from 'typeorm';
import { Shift } from './Shift.entity';

export abstract class Employee extends BaseClassProperties {
  @Column({
    length: 100,
    unique: true,
  })
  employeeId: string;
  @Column({
    length: 100,
  })
  department: string;
}
