import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Column, OneToMany } from 'typeorm';
import { Shift } from './Shift.entity';
import { User } from './user.entity';

export abstract class Employee extends User {
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
