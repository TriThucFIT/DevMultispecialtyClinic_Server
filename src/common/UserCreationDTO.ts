import { IsDateString, IsPhoneNumber, MaxLength } from 'class-validator';

export abstract class UserCreationDTO {
  fullName: string;
  email?: string;
  @IsPhoneNumber('VN')
  phone: string;
  @MaxLength(100)
  address?: string;
  gender: boolean;
  @IsDateString()
  dob: Date;
}
