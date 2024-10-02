import { IsArray, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Permission } from 'src/auth/entities/permission.entity';
import { Role } from 'src/auth/entities/role.entity';
import { DoctorCreationDto } from 'src/doctor/dto/doctor.dto';
import { RoleName } from 'src/enums/auth.enum';
import { ReceptionistCreationDto } from 'src/receptionist/dto/receptionist.request.dto';

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

export class CreateAccountDto {
  @IsNotEmpty()
  @Length(4, 50)
  readonly username: string;
  @IsNotEmpty()
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

export class CreateRoleDto {
  readonly name: RoleName;
  readonly permissions: (number | string | Permission)[];
}

export class CreatePermissionDto {
  readonly name: string;
  readonly description: string;
}
