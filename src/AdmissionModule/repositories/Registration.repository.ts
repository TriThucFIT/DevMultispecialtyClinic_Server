import { Injectable } from '@nestjs/common';
import { Registration } from '../entities/Registration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RegistrationRepository {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  async findAll(): Promise<Registration[]> {
    return this.registrationRepository.find();
  }

  async findOne(id: number): Promise<Registration> {
    return this.registrationRepository.findOne({ where: { id } });
  }

  async create(registration: Registration): Promise<Registration> {
    return this.registrationRepository.save(registration);
  }

  async update(registration: Registration): Promise<Registration> {
    return this.registrationRepository.save(registration);
  }

  async remove(id: number): Promise<void> {
    await this.registrationRepository.delete(id);
  }

  async findByPatientId(patientId: number): Promise<Registration[]> {
    return this.registrationRepository.find({
      where: { patient: { id: patientId } },
    });
  }

  async findByDoctorId(doctorId: number): Promise<Registration[]> {
    return this.registrationRepository.find({
      where: {
        doctor: { id: doctorId },
      },
    });
  }

  async findByReceptionistId(receptionistId: number): Promise<Registration[]> {
    return this.registrationRepository.find({
      where: { receptionist: { id: receptionistId } },
    });
  }

  async findByServiceId(serviceId: number): Promise<Registration[]> {
    return this.registrationRepository.find({
      where: { service: { id: serviceId } },
    });
  }

  async findByStatus(status: string): Promise<Registration[]> {
    return this.registrationRepository.find({ where: { status } });
  }
}
