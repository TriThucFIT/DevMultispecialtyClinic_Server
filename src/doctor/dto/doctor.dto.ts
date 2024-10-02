import { UserCreationDTO } from "src/common/UserCreationDTO";

export class DoctorAppointmentDto {
  name: string;
  specialization: string;
}

export class DoctorCreationDto extends UserCreationDTO{
  employeeId : string;
  specialization: string;
}


