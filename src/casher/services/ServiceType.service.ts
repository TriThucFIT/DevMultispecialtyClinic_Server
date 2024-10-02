import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceType } from '../entities/ServiceType.entity';

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async findAll() {
    return this.serviceTypeRepository.find();
  }

  async findOne(id: number) {
    return this.serviceTypeRepository.findOne({ where: { id } });
  }

  async findByName(name: string) {
    return this.serviceTypeRepository.findOne({ where: { name } });
  }

  async create(serviceType: ServiceType) {
    return this.serviceTypeRepository.save(serviceType);
  }
}
