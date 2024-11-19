import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Account } from './account.entity';
import { Permission } from './permission.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
<<<<<<< HEAD:src/auth/entities/role.entity.ts
import { RoleName } from 'src/enums/auth.enum';
import { Expose } from 'class-transformer';
=======
import { RoleName } from 'src/Common/Enums/auth.enum';
>>>>>>> 2ed803faf176af1a2b6ef2f3117e0ff22b1c3a92:src/AuthenticationModule/entities/role.entity.ts

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
}
