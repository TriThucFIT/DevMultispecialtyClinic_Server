import { IsArray, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { DoctorCreationDto } from 'src/DoctorModule/dto/doctor.dto';
import { RoleName } from 'src/Common/Enums/auth.enum';
import { ReceptionistCreationDto } from 'src/ReceptionistModule/dto/receptionist.request.dto';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { PatientCreationDto } from 'src/PatientModule/dto/patient.dto';

export class SignInDto {
  @IsNotEmpty({
    message: 'username is required',
  })
  username: string;
  @IsNotEmpty({
    message: 'password is required',
  })
  password: string;
}

export class CreateBlankAccountDto {
  @IsNotEmpty()
  @Length(4, 50)
  readonly username: string;
  @IsNotEmpty()
  readonly password: string;
}

export class CreateAccountDto {
  @IsNotEmpty()
  @Length(4, 50)
  readonly username: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
  @IsArray({
    message: 'roles must be an array of RoleName or RoleId',
  })
  readonly roles?: (RoleName | number | Role)[];
  readonly department?: RoleName;
  readonly entity?: DoctorCreationDto | ReceptionistCreationDto | any;
}

export class CreatePatientAccountDto {
  @IsNotEmpty()
  readonly username: string;
  readonly email?: string;
  @IsNotEmpty()
  readonly password: string;
  patient: PatientCreationDto;
  roles: RoleName[];
}

export class CreateRoleDto {
  readonly name: RoleName;
  permissions: (number | Permission)[];
}

export class CreatePermissionDto {
  readonly name: string;
  readonly description: string;
}
