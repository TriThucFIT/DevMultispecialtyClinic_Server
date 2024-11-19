import { Entity, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
<<<<<<< HEAD:src/auth/entities/permission.entity.ts
import { Action, Resource } from 'src/enums/auth.enum';
=======
import { Action, Resource } from 'src/Common/Enums/auth.enum';
>>>>>>> 2ed803faf176af1a2b6ef2f3117e0ff22b1c3a92:src/AuthenticationModule/entities/permission.entity.ts

@Entity('permissions')
export class Permission extends BaseClassProperties {
  description: string;
  @Column({
    type: 'enum',
    enum: Resource,
  })
  resource: Resource;

  @Column({
    type: 'enum',
    enum: Action,
  })
  action: Action;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
