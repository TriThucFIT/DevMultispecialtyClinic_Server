import { Employee } from 'src/AuthenticationModule/entities/employee.entity';
import { Entity } from 'typeorm';

@Entity('pharmacist')
export class Pharmacist extends Employee {}
