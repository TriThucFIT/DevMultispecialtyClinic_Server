import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { BaseDTO } from 'src/Common/BaseDTO';
import { DoctorResponseDto } from 'src/DoctorModule/dto/doctor.response.dto';

export class LabTestCreationDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  doctorId: string;
  @IsNotEmpty()
  category: number | LabTestCategoryCreationDTO;
}

export class LabTestCategoryCreationDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
}

export type LabTestRequestDTO = {};

export class LabTestCategoryResponseDTO extends BaseDTO {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  @Type(() => LabTestResponseDTO)
  labtests: LabTestResponseDTO[];
}

export class LabTestResponseDTO extends BaseDTO {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  price: number;
  @Expose()
  @Type(() => DoctorResponseDto)
  doctor: DoctorResponseDto;
}

export class TestResultResponseDTO extends BaseDTO {
  @Expose()
  result: string;
  @Expose()
  detail: Record<string, any>[];
  @Expose()
  notes: string;
  @Expose()
  images: string[];
}

export class LabResults {
  id: string;
  name: string;
  testResults: TestResultResponseDTO[];
}
