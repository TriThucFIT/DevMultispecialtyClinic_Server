// ?Permission Repository

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { Action, Resource } from 'src/Common/Enums/auth.enum';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  create(permission: Permission): Promise<Permission> {
    return this.permissionRepository.save(permission);
  }

  findOne(id: number): Promise<Permission | null> {
    return this.permissionRepository.findOne({ where: { id } });
  }

  findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }
  async findByResourceAndAction(
    resource: Resource,
    action: Action,
  ): Promise<Permission | undefined> {
    return this.permissionRepository.findOne({ where: { resource, action } });
  }

  async remove(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}
