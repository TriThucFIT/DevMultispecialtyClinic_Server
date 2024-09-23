import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from './repositories/role.repository';
import { CreateUserDto, SignInDto } from 'src/dto/auth.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserRepository,
    private roleService: RoleRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(signInRequest: SignInDto) {
    const user = await this.userService.findOne(signInRequest.username);
    Logger.log(user);
    
    if (user?.password !== signInRequest.password) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async createAccount(createUserDto: CreateUserDto) {
    const roles = await this.roleService.findByNamesOrIds(
      createUserDto.roles || [],
    );
    if (!roles.length) {
      const roleEntity = await this.roleService.create({
        name: 'user',
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

  async setRoles(username: string, roles: (string | number)[]) {
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
