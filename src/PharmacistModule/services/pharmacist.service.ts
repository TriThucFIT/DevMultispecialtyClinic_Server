import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacist } from '../entities/pharmacist.entity';
import { PharmacistCreationDTO } from '../types/Pharmacist.type';

@Injectable()
export class PharmacistService {
  constructor(
    @InjectRepository(Pharmacist)
    private readonly pharmacistRepository: Repository<Pharmacist>,
  ) {}

  async createPharmacist(
    pharmacist: PharmacistCreationDTO,
  ): Promise<Pharmacist> {
    return this.pharmacistRepository.save(pharmacist);
  }

  async findByAccount(accountId: number): Promise<Pharmacist> {
    return this.pharmacistRepository.findOne({
      where: { account: { id: accountId } },
    });
  }
}
