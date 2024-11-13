import { PatientCreationDto } from 'src/PatientModule/dto/patient.dto';
import { AdmissionSattus } from '../enums';
import { Address } from 'src/AuthenticationModule/entities/Address.type';

export class CreateAdmissionDto {
  status: string;
  isWalkIn: boolean;
  patient: PatientCreationDto;
  doctor_id?: number;
  receptionist_useranme: string;
  appointment_id?: number;
  service: number | string;
  date?: Date;
  symptoms?: string;
  specialization?: string;
}

export class CreateEmergencyDTO {
  fullName: string;
  age: number;
  symptoms: string;
  gender: boolean;
  status: AdmissionSattus;
}

export class AcceptEmergency {
  doctor_id: string;
  registration_id: number;
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
  address?: Address;
}
