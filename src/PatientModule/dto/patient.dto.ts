import { Expose, Transform, Type } from 'class-transformer';
import { Address } from 'src/AuthenticationModule/entities/Address.type';
import { BaseDTO } from 'src/Common/BaseDTO';
import { UserCreationDTO } from 'src/Common/UserCreationDTO';
import { Patient } from '../entities/patient.entity';
import { MedicalRecord } from '../entities/MedicalRecord.entity';
import { LabRequestResponseDto } from 'src/LabTestModule/types/labRequest.type';
import { DoctorResponseDto } from 'src/DoctorModule/dto/doctor.response.dto';
import { IsNotEmpty } from 'class-validator';
import { Invoice } from 'src/CasherModule/entities/invoice.entity';
import {
  MedicationResponseDto,
  PrescriptionResponseDto,
} from 'src/PharmacistModule/types';
import {
  AppointmentResponseDto,
  CreateAppointmentDto,
} from 'src/AppointmentModule/dto/Appoitment.dto';

export type MedicalRecordCreation = {
  patient: string | Patient;
  notes: string;
  entries?: MedicalRecordEntryCreation[];
};

export type MedicalRecordEntryCreation = {
  record: number | MedicalRecord;
  invoice: Invoice;
  symptoms: string;
  doctorId: string;
};

export class PatientCreationDto extends UserCreationDTO {
  @Expose()
  patientId?: string;
  @Expose()
  priority: number;
}
export class PatientUpdateDto extends UserCreationDTO {}

export class PatientResponseDto extends BaseDTO {
  @Expose()
  fullName: string;
  @Expose()
  age: number;
  @Expose()
  priority: number;
  @Expose()
  patientId: string;
  @Expose()
  email?: string;
  @Expose()
  phone: string;
  @Expose()
  address: Address;
  @Expose()
  dob: Date;
  @Expose()
  gender: boolean;
  @Expose()
  accountId?: string;
}

export class MedicalInformationResponseDto extends BaseDTO {
  @Expose()
  bloodPressure: string;
  @Expose()
  heartRate: number;
  @Expose()
  temperature: number;
  @Expose()
  weight: number;
  @Expose()
  height: number;
}

export class MedicalRecordEntryResponseDto extends BaseDTO {
  @Expose()
  id: number;
  @Expose()
  symptoms: string;
  @Expose()
  note: string;
  @Expose()
  @Type(() => DoctorResponseDto)
  doctor: DoctorResponseDto;
  @Expose()
  visitDate: Date;
  @Expose()
  diagnosis: string;
  @Expose()
  treatmentPlan: string;
  @Expose()
  @Type(() => MedicalInformationResponseDto)
  medicalInformation: MedicalInformationResponseDto;
  @Expose()
  @Type(() => LabRequestResponseDto)
  labRequests: LabRequestResponseDto[];
  @Expose()
  @Type(() => PrescriptionResponseDto)
  prescriptions: PrescriptionResponseDto[];
  @Expose()
  @Type(() => AppointmentResponseDto)
  appointment: AppointmentResponseDto;
}

export class MedicalRecordResponseDto extends BaseDTO {
  @Expose()
  id: number;
  @Expose()
  @Type(() => PatientResponseDto)
  patient: PatientResponseDto;
  @Expose()
  notes: string;
  @Expose()
  @Type(() => MedicalRecordEntryResponseDto)
  entries: MedicalRecordEntryResponseDto[];
}

export class TestResultCreationDto {
  @IsNotEmpty()
  result: string;
  @IsNotEmpty()
  detail: Record<string, any>[];
  @IsNotEmpty()
  notes: string;
  @IsNotEmpty()
  images: string[];
  @IsNotEmpty()
  labRequestId: number;
}

export class MedicalRecordEntryUpdate {
  @IsNotEmpty()
  medicalRecordEntryId: number;
  @IsNotEmpty()
  diagnosis: string;
  treatmentPlan: string;
  additionalNote: string;
}
