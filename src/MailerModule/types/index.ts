import {
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MedicationToMail {
  @IsString()
  name: string;

  @IsString()
  dosage: string;

  @IsString()
  usage: string;

  @IsString()
  unitStock: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;
}

class LabTestDto {
  @IsString()
  name: string;

  @IsString()
  result: string;

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class MedicalRecordSumary {
  @IsDate()
  visitDate: string;

  @IsString()
  symptoms: string;

  @IsString()
  diagnosis: string;

  @IsString()
  treatmentPlan: string;

  @ValidateNested({ each: true })
  @Type(() => MedicationToMail)
  @IsArray()
  prescriptions: MedicationToMail[];

  @IsString()
  totalAmountPrescriptions: string;

  @ValidateNested({ each: true })
  @Type(() => LabTestDto)
  @IsArray()
  @IsOptional()
  labRequests?: LabTestDto[];

  @IsString()
  totalAmountLabTests: string;

  @IsString()
  doctorName: string;

  @IsString()
  doctorPhone: string;

  @IsString()
  note: string;
}
