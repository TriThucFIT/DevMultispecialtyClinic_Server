import { Injectable } from '@nestjs/common';
import { DoctorCreationDto } from './dto/doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async findAll() {
    return this.doctorRepository.find();
  }

  async findOne(id: number) {
    return this.doctorRepository.findOne({ where: { id } });
  }

  async findByAccount(accountId: number) {
    return this.doctorRepository.findOne({
      where: {
        account: {
          id: accountId,
        },
      },
    });
  }

  async findByNameAndSpecialty(name: string, specialty: string) {
    return this.doctorRepository.findOne({
      where: { fullName: name, specialization: specialty },
    });
  }

  async create(doctor: DoctorCreationDto) {
    return this.doctorRepository.save(doctor);
  }
}
