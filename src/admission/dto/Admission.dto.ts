import { PatientCreationDto } from 'src/patient/dto/patient.dto';

export class CreateAdmissionDto {
  status: string;
  isWalkIn: boolean;
  patient: PatientCreationDto;
  doctor_id?: number;
  receptionist_phone: string;
  appointment_id?: number;
  service: number;
  date?: Date;
  symptoms?: string;
  specialization?: string;
}

export class PatientSendToQueue {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  age?: number;
  condition?: string;
  priority?: number;
  status?: string;
  arrivalOrder?: number;
  gender?: boolean;
  symptoms?: string;
  waitingTime?: number;
  address?: string;
}
