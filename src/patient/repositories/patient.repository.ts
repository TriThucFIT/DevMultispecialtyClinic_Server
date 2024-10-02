import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientRepository extends Repository<Patient> {}
