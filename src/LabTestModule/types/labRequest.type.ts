import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from 'src/Common/BaseDTO';
import { DoctorResponseDto } from 'src/DoctorModule/dto/doctor.response.dto';
import { PatientResponseDto } from 'src/PatientModule/dto/patient.dto';

export class LabRequestCreation {
  @IsNotEmpty()
  doctorId: string;
  @IsNotEmpty()
  labTestId: number;
  @IsNotEmpty()
  medicalRecordEntryId: number;
}

export class LabTestResponseDto extends BaseDTO {
  @Expose()
  name: string;
  @Expose()
  price: number;
}

export class TestResultResponseDto extends BaseDTO {
  @Expose()
  result: string;
  @Expose()
  detail: Record<string, any>[];
  @Expose()
  notes: string;
  @Expose()
  images: string[];
}

export class LabRequestResponseDto extends BaseDTO {
  @Expose()
  @Type(() => DoctorResponseDto)
  doctor: DoctorResponseDto;
  @Expose()
  @Type(() => PatientResponseDto)
  patient: PatientResponseDto;
  @Expose()
  @Type(() => LabTestResponseDto)
  labTest: LabTestResponseDto;
  @Expose()
  requestDate: Date;
  @Expose()
  status: string;
  @Expose()
  @Type(() => TestResultResponseDto)
  testResult?: TestResultResponseDto;
}
