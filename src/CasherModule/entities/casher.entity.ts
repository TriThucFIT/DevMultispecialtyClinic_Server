import { Employee } from 'src/AuthenticationModule/entities/employee.entity';
import { Entity } from 'typeorm';

@Entity('casher')
export class Casher extends Employee {}
