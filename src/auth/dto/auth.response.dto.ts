import { Expose, Type } from 'class-transformer';
import { BaseDTO } from 'src/common/BaseDTO';
import { Action, Resource, RoleName } from 'src/enums/auth.enum';

export class UserProfileDTO extends BaseDTO {
  @Expose()
  email?: string;
  @Expose()
  phone?: string;
  @Expose()
  username?: string;
  @Expose()
  fullName?: string;
  @Expose()
  address?: string;
  @Expose()
  gender?: boolean;
  @Expose()
  dob?: Date;
  @Expose()
  type_account?: {
    type: string;
    id: number;
    specialization?: string;
  };
  @Expose()
  specialization?: string;
  @Expose()
  @Type(() => RoleResponseDto)
  roles?: RoleResponseDto[];
}

export class RoleResponseDto extends BaseDTO {
  @Expose()
  name: RoleName;
  @Expose()
  @Type(() => PermissionResponseDto)
  permissions: PermissionResponseDto[];
}

export class PermissionResponseDto extends BaseDTO {
  @Expose()
  resource: Resource;
  @Expose()
  action: Action[];
}
