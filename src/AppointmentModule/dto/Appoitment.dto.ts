import { Type } from 'class-transformer';
import { IsString, Matches, ValidateNested } from 'class-validator';
import { DoctorAppointmentDto } from 'src/DoctorModule/dto/doctor.dto';
import { PatientCreationDto } from 'src/PatientModule/dto/patient.dto';

export class CreateAppointmentDto {
  status?: string;
  isWalkIn?: boolean;
  service: string;
  doctor?: DoctorAppointmentDto;
  date: Date;
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in the format HH:MM',
  })
  time: string;
  symptoms: string;
  @ValidateNested()
  @Type(() => PatientCreationDto)
  patient: PatientCreationDto;
}
