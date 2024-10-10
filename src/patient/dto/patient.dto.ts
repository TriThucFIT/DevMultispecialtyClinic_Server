import { Expose } from 'class-transformer';
import { BaseDTO } from 'src/common/BaseDTO';
import { UserCreationDTO } from 'src/common/UserCreationDTO';

export class PatientCreationDto extends UserCreationDTO {}

export class PatientResponseDto extends BaseDTO{
  @Expose()
  fullName: string;
  @Expose()
  email?: string;
  @Expose()
  phone: string;
  @Expose()
  address: string;
  @Expose()
  dob: Date;
  @Expose()
  gender: boolean;
}
