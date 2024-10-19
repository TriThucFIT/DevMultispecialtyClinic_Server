import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from './repositories/account.repository';
import { RoleRepository } from './repositories/role.repository';
import { RoleName } from 'src/enums/auth.enum';
import {
  CreateAccountDto,
  CreateBlankAccountDto,
  SignInDto,
} from './dto/auth.request.dto';
import { UserProfileDTO } from './dto/auth.response.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { ReceptionistService } from 'src/receptionist/receptionist.service';
import { log } from 'console';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: AccountRepository,
    private roleService: RoleRepository,
    @InjectRepository(Permission)
    private permissionService: Repository<Permission>,
    private jwtService: JwtService,
    private doctorService: DoctorService,
    private receptionistService: ReceptionistService,
  ) {}

  async signIn(signInRequest: SignInDto) {
    const user = await this.userService.findOne(signInRequest.username);
    if (!(user && (await user?.comparePassword(signInRequest.password)))) {
      throw new UnauthorizedException();
    }
    const payload = {
      username: user.username,
      sub: user.username,
      roles: user.roleList,
      permissions: user.permissionList,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      }),
    };
  }
  async createAccount(createUserDto: CreateAccountDto) {
    try {
      if (!createUserDto.department) {
        throw new Error('Department is required');
      }
      const roles = await this.roleService.findByNamesOrIds(
        createUserDto.roles || [],
      );
      if (!roles.length) {
        const roleEntity = await this.roleService.create({
          name: RoleName.Guest,
          permissions: [],
        });
        const user = await this.userService.create(createUserDto);
        this.userService.setRole(user.username, roleEntity);
        return user;
      }
      const user = await this.userService.create(createUserDto);
      roles.forEach((role) => {
        this.userService.setRole(user.username, role);
      });

      switch (createUserDto.department) {
        case RoleName.Doctor:
          await this.doctorService.create({
            ...createUserDto.entity,
            account: user,
          });
          break;
        case RoleName.Receptionist:
          await this.receptionistService.create({
            ...createUserDto.entity,
            account: user,
          });
          break;
        default:
          break;
      }
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async setRoles(username: string, roles: RoleName[]) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException({
        message: 'Account not found',
      });
    }
    const roleEntities = await this.roleService.findByNamesOrIds(roles);
    if (!roleEntities.length) {
      throw new NotFoundException({
        message: 'Role not found',
      });
    }
    roleEntities.forEach((role) => {
      this.userService.setRole(username, role);
    });
    return user;
  }

  async setPermissions(username: string, permissions: Permission[]) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException({
        message: 'Account not found',
      });
    }
    const permissionEntities = await this.permissionService.find({
      where: permissions.map((permission) => ({
        action: permission.action,
        resource: permission.resource,
      })),
    });
    if (!permissionEntities.length) {
      throw new NotFoundException({
        message: 'Permission not found',
      });
    }
    permissionEntities.forEach((permission) => {
      this.userService.setPermission(username, permission);
    });
    return user;
  }

  async getProfile(username: string): Promise<UserProfileDTO> {
    const account = await this.userService.findOne(username);
    if (!account) {
      throw new NotFoundException({
        message: 'Account not found',
      });
    }

    log('account', account);

    const accountResponse = {
      ...account,
      roles: account.roles.map((role) => ({
        ...role,
        permissions: role.permissions.map((permission) => ({
          ...permission,
          action: [permission.action],
        })),
      })),
    };

    switch (account.roleList[0]) {
      case RoleName.Admin:
        return UserProfileDTO.plainToInstance(accountResponse);
      case RoleName.Doctor:
        log('RoleName.Doctor', account.id);
        try {
          const doctor = await this.doctorService.findByAccount(account.id);
          log('doctor', doctor);
          return UserProfileDTO.plainToInstance({
            ...accountResponse,
            ...doctor,
            specialization: {
              name: doctor.specialization.name,
              specialization_id: doctor.specialization.specialization_id,
            },
          });
        } catch (error) {
          log('error', error);
          return UserProfileDTO.plainToInstance(accountResponse);
        }

      case RoleName.Receptionist:
        const receptionist = await this.receptionistService.findByAccount(
          account.id,
        );
        return UserProfileDTO.plainToInstance({
          ...accountResponse,
          ...receptionist,
        });
      default:
        return UserProfileDTO.plainToInstance(accountResponse);
    }
  }
}
