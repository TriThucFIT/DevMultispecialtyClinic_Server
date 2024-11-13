import { Entity, Column, ManyToMany, JoinTable, BeforeInsert } from 'typeorm';
import { Role } from './role.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import * as bcrypt from 'bcrypt';
import { Permission } from './permission.entity';

@Entity('accounts')
export class Account extends BaseClassProperties {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'account_roles',
    joinColumn: { name: 'account_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  get roleList() {
    return this.roles.map((role: Role) => role.name);
  }

  get permissionList() {
    return this.roles
      .map((role) => role.permissions)
      .flat()
      .map((perm: Permission) => {
        return {
          resource: perm.resource,
          actions: [perm.action],
        };
      });
  }

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
