import { Expose } from 'class-transformer';
import { Address } from 'src/auth/entities/Address.type';
import { BaseDTO } from 'src/common/BaseDTO';
import { UserCreationDTO } from 'src/common/UserCreationDTO';

export class PatientCreationDto extends UserCreationDTO {
  @Expose()
  priority: number;

}

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
}
