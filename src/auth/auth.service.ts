import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountRepository } from './repositories/account.repository';
import { RoleRepository } from './repositories/role.repository';
import { CreateAccountDto, SignInDto } from 'src/dto/auth.request.dto';
import { RoleName } from 'src/enums/auth.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: AccountRepository,
    private roleService: RoleRepository,
    private jwtService: JwtService,
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
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async createAccount(createUserDto: CreateAccountDto) {
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
    return user;
  }

  async setRoles(username: string, roles: (RoleName | number)[]) {
    const roleEntity = await this.roleService.findByNamesOrIds(roles);
    if (!roleEntity.length) {
      throw new NotFoundException('Role not found');
    }
    roleEntity.forEach((role) => {
      this.userService.setRole(username, role);
    });
    return this.userService.findOne(username);
  }
}
