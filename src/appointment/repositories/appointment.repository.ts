import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentRepository extends Repository<Appointment> {}
