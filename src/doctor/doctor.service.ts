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
    return this.doctorRepository.find({
      where: {
        isActive: true,
      },
    });
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

  async findBySpecialization(specialization: string) {
    return this.doctorRepository.find({
      where: { specialization: specialization },
    });
  }

  async findAllSpecializations() {
    const doctors = await this.doctorRepository.find({
      select: ['specialization'],
      where: { isActive: true },
    });

    const specializations = [
      ...new Set(doctors.map((doctor) => doctor.specialization)),
    ];

    return specializations;
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
