import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Role } from '../entities/role.entity';
import {
  CreateAccountDto,
  CreatePatientAccountDto,
} from '../dto/auth.request.dto';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private usersRepository: Repository<Account>,
  ) {}

  findAll(): Promise<Account[]> {
    return this.usersRepository.find();
  }

  findOne(username: string): Promise<Account | null> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(
    createAccount: CreateAccountDto | CreatePatientAccountDto,
  ): Promise<Account> {
    const account = new Account();
    account.username = createAccount.username;
    account.password = createAccount.password;
    account.email = createAccount.email;
    account.roles = createAccount.roles as Role[];
    return this.usersRepository.save(account);
  }

  async setRole(username: string, role: Role): Promise<Account> {
    const account = await this.usersRepository.findOne({ where: { username } });
    account.roles = [account.roles, role].flat();
    return this.usersRepository.save(account);
  }

  async setPermission(username: string, permission: Permission) {
    const account = await this.usersRepository.findOne({
      where: {
        username,
      },
    });
    if (!account) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    } else {
      account.roles.forEach((role) => {
        role.permissions.map((per) => {
          if (per.resource === permission.resource) {
            per.action = permission.action;
          }
        });
      });
      return this.usersRepository.save(account);
    }
  }

  async update(
    id: number,
    username: string,
    password: string,
  ): Promise<Account> {
    const account = await this.usersRepository.findOne({ where: { id } });
    account.username = username;
    account.password = password;
    return this.usersRepository.save(account);
  }

  async save(account: Account): Promise<Account> {
    return this.usersRepository.save(account);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
