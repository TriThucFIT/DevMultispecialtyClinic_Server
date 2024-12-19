import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from './repositories/account.repository';
import { RoleRepository } from './repositories/role.repository';
import { RoleName } from 'src/Common/Enums/auth.enum';
import {
  CreateAccountDto,
  CreatePatientAccountDto,
  CreateRoleDto,
  SignInDto,
} from './dto/auth.request.dto';
import { UserProfileDTO } from './dto/auth.response.dto';
import { DoctorService } from 'src/DoctorModule/doctor.service';
import { ReceptionistService } from 'src/ReceptionistModule/receptionist.service';
import { log } from 'console';
import { Permission } from './entities/permission.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CasherService } from 'src/CasherModule/casher.service';
import { PatientService } from 'src/PatientModule/services/patient.service';
import { PharmacistService } from 'src/PharmacistModule/services/pharmacist.service';
import { CustomMailerService } from 'src/MailerModule/MailerModule.service';

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
    private casherService: CasherService,
    private patientService: PatientService,
    private pharmacistService: PharmacistService,
    private mailService: CustomMailerService,
  ) {}

  async signIn(signInRequest: SignInDto) {
    const user = await this.userService.findOne(signInRequest.username);
    log('user', user);
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
    console.log('createUserDto', createUserDto);

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

      console.log('roles', roles);

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

        case RoleName.Casher:
          await this.casherService.create({
            ...createUserDto.entity,
            account: user,
          });
          break;

        case RoleName.Pharmacist:
          await this.pharmacistService.createPharmacist({
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

  async createPatientAccount(createPatientAccountDto: CreatePatientAccountDto) {
    await this.checkUsernameExist(createPatientAccountDto.username);
    let patient = null;

    const roles = await this.roleService.findByNamesOrIds([RoleName.Patient]);
    createPatientAccountDto.roles = [RoleName.Patient];
    const account = await this.userService.create(createPatientAccountDto);
    this.userService.setRole(createPatientAccountDto.username, roles[0]);

    if (createPatientAccountDto.patient.patientId) {
      patient = await this.checkPatientId(
        createPatientAccountDto.patient.patientId,
      );
    } else {
      patient = await this.patientService.create({
        ...createPatientAccountDto.patient,
      });
    }

    patient.account = account;
    await this.patientService.updateAccount(patient.id, patient);
    return patient;
  }

  // async checkUsernameExist(username: string) {
  //   const account = await this.userService.findOne(username);
  //   console.log('account', account);

  //   if (account) {
  //     throw new BadRequestException({
  //       message: 'Tên đăng nhập đã tồn tại',
  //     });
  //   }
  //   return {
  //     message: 'Tên đăng nhập hợp lệ',
  //   };
  // }

  async checkUsernameExist(username: string) {
    const account = await this.userService.findOne(username);
    console.log('account', account);
    const patient = await this.patientService.findByAccount(account?.id);
    if (account) {
      return {
        data: patient.phone,
        message: 'Tên đăng nhập đã tồn tại',
        isExist: true,
      };
    }
    return {
      message: 'Tên đăng nhập hợp lệ',
      isExist: false,
    };
  }

  async checkPatientId(patientId: string) {
    const patient = await this.patientService.findOne(patientId);
    const isValidPatientId = /^PAT\d{2,}$/.test(patientId);
    console.log('patient', patient);

    if (!isValidPatientId) {
      throw new BadRequestException({
        message: 'Mã bệnh nhân không hợp lệ',
      });
    }
    if (!patient) {
      throw new NotFoundException({
        message: 'Mã bệnh nhân không tồn tại',
      });
    }
    if (patient.account) {
      throw new BadRequestException({
        message: 'Tài khoản đã tồn tại',
      });
    }
    return patient;
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
        try {
          const doctor = await this.doctorService.findByAccount(account.id);
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

      case RoleName.Casher:
        const casher = await this.casherService.findByAccount(account.id);
        return UserProfileDTO.plainToInstance({
          ...accountResponse,
          ...casher,
        });
      case RoleName.Patient:
        const patient = await this.patientService.findByAccount(account.id);
        return UserProfileDTO.plainToInstance({
          ...accountResponse,
          ...patient,
        });
      case RoleName.Pharmacist:
        const pharmacist = await this.pharmacistService.findByAccount(
          account.id,
        );
        return UserProfileDTO.plainToInstance({
          ...accountResponse,
          ...pharmacist,
        });
      default:
        return UserProfileDTO.plainToInstance(accountResponse);
    }
  }

  async createRole(createRoleDto: CreateRoleDto) {
    try {
      if (!createRoleDto.name) throw new Error('Role name is required');

      if (createRoleDto.permissions) {
        const permissions = await this.permissionService.find({
          where: {
            id: In(createRoleDto.permissions.flat() as number[]),
          },
        });
        if (!permissions.length) {
          throw new Error('Permission not found');
        }
        createRoleDto.permissions = permissions;
        const role =
          await this.roleService.createWithPermissions(createRoleDto);
        return role;
      }
      const role = await this.roleService.create(createRoleDto);
      return role;
    } catch (error) {
      throw new Error(error);
    }
  }

  async resetPassword(
    username: string,
    old_password: string,
    new_password: string,
  ) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException({
        message: 'Không tìm thấy tài khoản',
      });
    }
    if (!(await user.comparePassword(old_password))) {
      throw new UnauthorizedException({
        message: 'Mật khẩu cũ không đúng',
      });
    }
    user.password = new_password;
    await this.userService.save(user);
    return true;
  }

  async forgotPassword(username: string) {
    const user = username.includes('@')
      ? await this.userService.findByEmail(username)
      : await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException({
        message: 'Không tìm thấy tài khoản',
      });
    } else if (user.email === null) {
      throw new NotFoundException({
        message: 'Tài khoản không có email liên kết',
      });
    }

    const tempPass = this.generateTempPassword();
    user.password = tempPass;
    await this.userService.save(user);
    await this.mailService.sendResetPasswordEmail(user.email, {
      name: user.username,
      temporaryPassword: tempPass,
    });
    return true;
  }

  private generateTempPassword() {
    return Math.random().toString(36).slice(-8);
  }
}
