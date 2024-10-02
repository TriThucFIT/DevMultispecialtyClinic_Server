import { Injectable } from '@nestjs/common';
import { PatientCreationDto } from './dto/patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async findAll() {
    return this.patientRepository.find();
  }

  async findOne(id: number) {
    return this.patientRepository.findOne({ where: { id } });
  }

  async findByPhone(phone: string) {
    return this.patientRepository.findOne({ where: { phone } });
  }

  async create(patient: PatientCreationDto) {
    return this.patientRepository.save(patient);
  }
}
