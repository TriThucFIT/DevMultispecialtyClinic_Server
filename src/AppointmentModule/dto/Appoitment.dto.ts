import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
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
  medicalRecordEntryId?: number;
}

export class AvailableAppointmentParams {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Định dạng ngày theo dạng YYYY-MM-DD',
  })
  date: string;
  @IsNotEmpty({
    message: 'Thiếu tham số Chuyên khoa'
  })
  specialization: string;
}
export class AppointmentResponseDto {
  @Expose()
  id: number;
  @Expose()
  date: string;
  @Expose()
  time: string;
  @Expose()
  symptoms: string;
  @Expose()
  isWalkIn: boolean;
  @Expose()
  status: string;
  @Expose()
  service: string;
  @Expose()
  @Type(() => PatientCreationDto)
  patient: PatientCreationDto;
  @Expose()
  @Type(() => DoctorAppointmentDto)
  doctor: DoctorAppointmentDto;
}

export class AvailableAppointments {
  @Expose()
  date: Date;
  @Expose()
  specialization: {
    id: string;
    name: string;
  };
  @Expose()
  doctor: {
    id: number;
    name: string;
    availableSlots: string[]; // HH:MM
  }[];
}
