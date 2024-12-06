import { Injectable } from '@nestjs/common';
import { DoctorCreationDto, SpecializationCreationDTO } from './dto/doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';
import { Specialization } from './entities/specialization.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
  ) {}

  async findAll() {
    return this.doctorRepository.find({
      where: {
        isActive: true,
      },
      relations: ['specialization'],
    });
  }

  async findOne(id: number) {
    return this.doctorRepository.findOne({
      where: { id },
      relations: ['specialization'],
    });
  }
  async findByEmployeeId(employeeId: string) {
    return this.doctorRepository.findOne({
      where: {
        employeeId,
      },
    });
  }

  async findByAccount(accountId: number) {
    const doctor = await this.doctorRepository.findOne({
      where: {
        account: {
          id: accountId,
        },
      },
      relations: ['specialization'],
    });
    return doctor;
  }

  async findBySpecialization(specialization_id: string) {
    return this.doctorRepository.find({
      where: {
        specialization: {
          specialization_id,
        },
      },
    });
  }

  async findByNameAndSpecialty(name: string, specialty: string) {
    return this.doctorRepository.findOne({
      where: {
        fullName: name,
        specialization: {
          specialization_id: specialty,
        },
      },
    });
  }

  async create(doctor: DoctorCreationDto) {
    return this.doctorRepository.save(doctor);
  }

  async createMany(doctors: Doctor[]) {
    const result = await this.doctorRepository.save(doctors);
    return result;
  }

  // Specialization

  async createSpecialization(specialization: SpecializationCreationDTO) {
    return this.specializationRepository.save(specialization);
  }

  async createManySpecializations(
    specializations: SpecializationCreationDTO[],
  ) {
    return this.specializationRepository.save(specializations);
  }

  async updateSpecialization(specialization: Specialization) {
    return this.specializationRepository.save(specialization);
  }

  async deleteSpecialization(specialization_id: string) {
    return this.specializationRepository.delete({ specialization_id });
  }
  async findAllSpecializations() {
    return this.specializationRepository.find();
  }

  async findSpecialization(specialization_id: string) {
    return this.specializationRepository.findOne({
      where: {
        specialization_id,
      },
    });
  }

  async findDoctorBySpecialization(specialization_id: string) {
    return this.doctorRepository.find({
      where: {
        specialization: {
          specialization_id,
        },
      },
    });
  }
}
