import { Expose } from "class-transformer";
import { UserProfileDTO } from "src/AuthenticationModule/dto/auth.response.dto";

export class DoctorResponseDto extends UserProfileDTO{
  @Expose()
  employeeId: string;
}
