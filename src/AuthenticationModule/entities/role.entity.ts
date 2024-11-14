import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Account } from './account.entity';
import { Permission } from './permission.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { RoleName } from 'src/Common/Enums/auth.enum';
import { Expose } from 'class-transformer';

@Entity('roles')
export class Role extends BaseClassProperties {
  @Column({ unique: true, type: 'enum', enum: RoleName })
  name: RoleName;

  @ManyToMany(() => Account, (acc) => acc.roles)
  users: Account[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @Expose()
  get roleNames() {
    return this.roleNames.map((role) => role.name);
  }

  @Expose()
  get permissionNames() {
    return this.roleNames
      .map((role) => role.permissions)
      .flat()
      .map((perm) => `${perm.resource}:${perm.action}`);
  }
}
