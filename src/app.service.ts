import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from './auth/repositories/account.repository';
import { RoleRepository } from './auth/repositories/role.repository';
import { PermissionRepository } from './auth/repositories/pemission.repository';
import { Permission } from './auth/entities/permission.entity';
import { RoleName, Resource, Action } from './enums/auth.enum';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async onModuleInit() {
    const adminExists = await this.accountRepository.findOne('admin');

    if (!adminExists) {
      const permissionsList: { resource: Resource; action: Action }[] = [];

      for (const resource of Object.values(Resource)) {
        for (const action of Object.values(Action)) {
          permissionsList.push({ resource, action });
        }
      }

      const permissions: Permission[] = [];
      for (const perm of permissionsList) {
        let permission =
          await this.permissionRepository.findByResourceAndAction(
            perm.resource,
            perm.action,
          );
        if (!permission) {
          permission = await this.permissionRepository.create(
            perm as Permission,
          );
        }
        permissions.push(permission);
      }

      let adminRole = await this.roleRepository.findByName(RoleName.Admin);
      if (!adminRole) {
        adminRole = await this.roleRepository.createWithPermissions({
          name: RoleName.Admin,
          permissions: [
            {
              resource: Resource.All,
              action: Action.All,
              description: 'Full access to all resources',
              roles: [],
              id: 1,
              isActive: true,
            } as unknown as Permission,
          ],
        });
      }

      let doctorRole = await this.roleRepository.findByName(RoleName.Doctor);
      if (!doctorRole) {
        doctorRole = await this.roleRepository.createWithPermissions({
          name: RoleName.Doctor,
          permissions: permissions.filter(
            (p) =>
              (p.resource === Resource.Patient && p.action === Action.View) ||
              (p.resource === Resource.Appointment &&
                p.action === Action.Manage),
          ),
        });
      }

      let receptionistRole = await this.roleRepository.findByName(
        RoleName.Receptionist,
      );
      if (!receptionistRole) {
        receptionistRole = await this.roleRepository.createWithPermissions({
          name: RoleName.Receptionist,
          permissions: permissions.filter(
            (p) =>
              (p.resource === Resource.Appointment &&
                p.action === Action.Manage) ||
              (p.resource === Resource.Patient && p.action === Action.View),
          ),
        });
      }

      this.accountRepository.create({
        username: process.env.ADMIN_NAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@dmc.clinic.com',
        password: process.env.ADMIN_PASS || 'adminSecurePassword',
        roles: [adminRole],
      });
      Logger.log('Admin account created');
    } else {
      Logger.log('Admin account already exists');
    }
  }
}
