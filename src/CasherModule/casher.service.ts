import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { Casher } from './entities/casher.entity';
import { CasherCreationDTO } from './dto/casher';

@Injectable()
export class CasherService {
  constructor(
    @InjectRepository(Casher)
    private readonly casherRepository: Repository<Casher>,
  ) {}

  async findAll() {
    return this.casherRepository.find();
  }

  async findOne(id: number) {
    return this.casherRepository.findOne({ where: { id } });
  }

  async findByName(name: string) {
    return this.casherRepository.findOne({ where: { fullName: name } });
  }

  async findByAccount(accountId?: number, username?: string) {
    const queryClause = accountId ? { id: accountId } : { username };
    return this.casherRepository.findOne({
      where: {
        account: queryClause,
      },
    });
  }

  async create(casher: CasherCreationDTO) {
    log('Creating Casher: ', casher);
    return this.casherRepository.save(casher);
  }

  async update(id: number, casher: Casher) {
    return this.casherRepository.update(id, casher);
  }

  async delete(id: number) {
    return this.casherRepository.delete(id);
  }

  async deleteAll() {
    return this.casherRepository.clear();
  }
}
