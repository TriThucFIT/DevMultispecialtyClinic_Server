// ?Permission Repository

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

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

  async remove(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}
