// Role Repository
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { In, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { RoleName } from 'src/enums/auth.enum';
import { CreateRoleDto } from '../dto/auth.request.dto';

   
@Injectable()
export class RoleRepository {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  create(createRole: CreateRoleDto): Promise<Role> {
    const role = new Role();
    role.name = createRole.name;
    return this.roleRepository.save(role);
  }

  createWithPermissions(createRole: CreateRoleDto): Promise<Role> {
    const role = new Role();
    role.name = createRole.name;
    role.permissions = createRole.permissions as Permission[];
    return this.roleRepository.save(role);
  }

  findOne(id: number): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { id } });
  }

  findByName(name: RoleName): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { name } });
  }

  findByNamesOrIds(names: (RoleName | number |Role)[]): Promise<Role[]> {
    return this.roleRepository.find({
      where: names.map((name) =>
        typeof name === 'string' ? { name } : { id: typeof name === 'number' ? name : name.id },
      ),
    });
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
