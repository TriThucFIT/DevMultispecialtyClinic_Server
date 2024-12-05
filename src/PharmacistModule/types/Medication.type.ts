import { Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { BaseDTO } from 'src/Common/BaseDTO';
import { PrescriptionStatus } from '../enums';

export class MedicationCreateDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  dosage: string;
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
  @IsNotEmpty()
  unitStock: string;
  @IsNotEmpty()
  desciption: string;
  @IsNotEmpty()
  usage: string;
  image: string;
}

export class MedicationResponseDto extends BaseDTO {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  dosage: string;
  @Expose()
  unitPrice: number;
  @Expose()
  inStock: number;
  @Expose()
  unitStock: string;
  @Expose()
  image: string;
  @Expose()
  description: string;
  @Expose()
  usage: string;
}

export class PrescriptionMedicationDto {
  @IsNotEmpty()
  medicationId: number;
  @IsNotEmpty()
  quantity: number;
  note: string;
}

export class PrescriptionMedicationResponse extends BaseDTO {
  @Expose()
  id: number;
  @Expose()
  @Type(() => MedicationResponseDto)
  medication: MedicationResponseDto;
  @Expose()
  quantity: number;
  @Expose()
  note: string;
}

export class PrescriptionResponseDto extends BaseDTO {
  @Expose()
  id: number;
  @Expose()
  note: string;
  @Expose()
  @Type(() => PrescriptionMedicationResponse)
  medications: PrescriptionMedicationResponse[];
}

export class PrescriptionDto {
  @IsNotEmpty()
  medicalRecordId: number;
  @IsNotEmpty()
  doctorId: string;
  note: string;
  @IsNotEmpty()
  @Type(() => PrescriptionMedicationDto)
  @ValidateNested({ each: true })
  medications: PrescriptionMedicationDto[];
}

export class PrescriptionUpdateDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  status: PrescriptionStatus;
  @IsNotEmpty()
  medicalRecordEntryId: number;
}
