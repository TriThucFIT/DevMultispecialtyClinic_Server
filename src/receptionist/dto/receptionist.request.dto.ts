import { UserCreationDTO } from "src/common/UserCreationDTO";

export class ReceptionistCreationDto extends UserCreationDTO {
  employeeId: string;
}