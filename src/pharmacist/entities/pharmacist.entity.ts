import { Employee } from 'src/auth/entities/employee.entity';
import { Entity } from 'typeorm';

@Entity('pharmacist')
export class Pharmacist extends Employee {}
