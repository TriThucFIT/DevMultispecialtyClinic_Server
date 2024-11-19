import { UserCreationDTO } from 'src/Common/UserCreationDTO';
import { Specialization } from '../entities/specialization.entity';

export class DoctorAppointmentDto {
  name: string;
  specialization: string;
}

export class DoctorCreationDto extends UserCreationDTO {
  employeeId: string;
  specialization: Specialization;
}

export class SpecializationCreationDTO {
  name: string;
  specialization_id: string;
}
