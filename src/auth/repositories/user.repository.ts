import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from 'src/dto/auth.request.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(ceateUser: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = ceateUser.username;
    user.password = ceateUser.password;
    user.email = ceateUser.email;
    return this.usersRepository.save(user);
  }

  async setRole(username: string, role: Role): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    user.roles = [role];
    return this.usersRepository.save(user);
  }

  async update(id: number, username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    user.username = username;
    user.password = password;
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
