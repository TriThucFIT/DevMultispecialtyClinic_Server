import { Employee } from 'src/AuthenticationModule/entities/employee.entity';
import { Column, Entity } from 'typeorm';

@Entity('casher')
export class Casher extends Employee {
  @Column()
  casherId: string;
}
