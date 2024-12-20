import { Entity, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Action, Resource } from 'src/Common/Enums/auth.enum';

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
