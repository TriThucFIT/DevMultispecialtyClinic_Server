import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Permission } from 'src/auth/entities/permission.entity';
import { Role } from 'src/auth/entities/role.entity';
import { RoleName } from 'src/enums/auth.enum';

export class SignInDto {
  username: string;
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
  readonly roles?: (RoleName | number | Role)[];
}

export class CreateRoleDto {
  readonly name: RoleName;
  readonly permissions: (number | string | Permission)[];
}

export class CreatePermissionDto {
  readonly name: string;
  readonly description: string;
}
