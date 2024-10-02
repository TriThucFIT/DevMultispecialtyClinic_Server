import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receptionist } from './entities/receptionist.entity';
import { Repository } from 'typeorm';
import { ReceptionistCreationDto } from './dto/receptionist.request.dto';

@Injectable()
export class ReceptionistService {
  constructor(
    @InjectRepository(Receptionist)
    private receptionistRepository: Repository<Receptionist>,
  ) {}

  async findAll(): Promise<Receptionist[]> {
    return this.receptionistRepository.find();
  }

  async findOne(id: number): Promise<Receptionist> {
    return this.receptionistRepository.findOne({ where: { id } });
  }

  async findByAccount(accountId: number): Promise<Receptionist> {
    return this.receptionistRepository.findOne({
      where: {
        account: {
          id: accountId,
        },
      },
    });
  }

  async create(
    createReceptionistDto: ReceptionistCreationDto,
  ): Promise<Receptionist> {
    return this.receptionistRepository.save(createReceptionistDto);
  }
}
