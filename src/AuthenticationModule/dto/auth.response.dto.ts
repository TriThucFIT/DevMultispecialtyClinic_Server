import { Expose, Type } from 'class-transformer';
import { BaseDTO } from 'src/Common/BaseDTO';
import { Action, Resource, RoleName } from 'src/Common/Enums/auth.enum';
import { Address } from '../entities/Address.type';

export class SpecializationDTO {
  @Expose()
  name: string;
  @Expose()
  specialization_id: string;
}

export class UserProfileDTO extends BaseDTO {
  @Expose()
  patientId?: string;
  @Expose()
  email?: string;
  @Expose()
  employeeId?: string;
  @Expose()
  phone?: string;
  @Expose()
  username?: string;
  @Expose()
  fullName?: string;
  @Expose()
  address?: Address;
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
  specialization?: SpecializationDTO;
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

