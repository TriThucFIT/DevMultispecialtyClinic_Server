export class SignInDto {
  username: string;
  password: string;
}

export class CreateUserDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly roles?: (string | number)[];
}

export class CreateRoleDto {
  readonly name: string;
  readonly permissions: (number | string)[];
}

export class CreatePermissionDto {
  readonly name: string;
}
