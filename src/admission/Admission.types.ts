import { UUID } from "crypto";

export type PatientRegistration = {
  id?: UUID
  name: string;
  dob: Date;
  gender: string;
  phone: string;
  priority?: number;
  seviceType: 'OVERTIME' | 'NORMAL' | 'EMERGENCY';
  serviceLevel: 'NORMAL' | 'VIP';
  specialist: string;
  symptoms: string;
};
