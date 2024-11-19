import { Expose } from 'class-transformer';
import { Address } from 'src/AuthenticationModule/entities/Address.type';
import { BaseDTO } from 'src/Common/BaseDTO';
import { UserCreationDTO } from 'src/Common/UserCreationDTO';

export class PatientCreationDto extends UserCreationDTO {
  @Expose()
  patientId?: string;
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
