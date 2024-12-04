import { UserCreationDTO } from 'src/Common/UserCreationDTO';
import { PrescriptionStatus } from '../enums';

export class PharmacistCreationDTO extends UserCreationDTO {
  employeeId: string;
}

export type PrescriptionSendToQueue = {
  medicalRecordEntryId: number;
  patient:Partial<PatientInPrescription> ;
  doctor: string;
  status: PrescriptionStatus;
};

export type PatientInPrescription = {
  id: number | string;
  name: string;
  phone: string;
  dob: string;
  priority: number;
};
