import { PatientCreationDto } from 'src/PatientModule/dto/patient.dto';
import { AdmissionSattus } from '../enums';
import { Address } from 'src/AuthenticationModule/entities/Address.type';
import { PaymentMethod } from 'src/CasherModule/enums/itemType.enum';
import { InvoiceStatus } from 'src/CasherModule/enums/InvoiceStatus.enum';

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

export class InvoiceSendToQueue {
  id: number;
  total_amount: number;
  status: InvoiceStatus;
  date: Date;
  patient: PatientSendToQueue;
  items: Partial<InvoiceItem>[];
}

class InvoiceItem {
  item: string;
  status: InvoiceStatus;
  quantity?: number;
  price: number;
}
