// doctor.response.dto.ts
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class DoctorResponseDto {
  employeeId: string;
  specialization: string;
}
