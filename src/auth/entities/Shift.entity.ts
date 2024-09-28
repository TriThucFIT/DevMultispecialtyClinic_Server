import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Column, JoinColumn, ManyToOne, Timestamp } from 'typeorm';
import { Employee } from './employee.entity';

export class Shift extends BaseClassProperties {
  @Column({
    type: 'time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startTime: Timestamp;
  @Column({
    type: 'time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  endTime: Timestamp;
  @Column({
    length: 100,
  })
  name: string;
  @Column()
  day: Date;

  @JoinColumn({
    name: 'employee_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Employee, (employee) => employee.id)
  employee: Employee;
}
