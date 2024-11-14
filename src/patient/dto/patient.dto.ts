import { Expose } from 'class-transformer';
import { Address } from 'src/auth/entities/Address..type';
import { BaseDTO } from 'src/common/BaseDTO';
import { UserCreationDTO } from 'src/common/UserCreationDTO';

export class PatientCreationDto extends UserCreationDTO {
  @Expose()
  patientId: string;
}

export class PatientResponseDto extends BaseDTO {
  @Expose()
  patientId: string;
  @Expose()
  fullName: string;
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
  accountId?: number;
}
