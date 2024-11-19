import { IsDateString, IsPhoneNumber, MaxLength } from 'class-validator';
import { Address } from 'src/AuthenticationModule/entities/Address.type';

export abstract class UserCreationDTO {
  fullName: string;
  email?: string;
  @IsPhoneNumber('VN')
  phone?: string;
  address?: Address;
  gender: boolean;
  @IsDateString()
  dob: Date;
}
