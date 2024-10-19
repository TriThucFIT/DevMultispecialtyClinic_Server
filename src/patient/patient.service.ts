import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientCreationDto, PatientResponseDto } from './dto/patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Like, Or, Repository } from 'typeorm';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async findAll(
    phone?: string,
    fullName?: string,
    email?: string,
    id?: number,
  ): Promise<PatientResponseDto[]> {
    const queryClause = id
      ? { id }
      : phone
        ? { phone: Like(`%${phone}%`) }
        : fullName
          ? { fullName: Like(`%${fullName}%`) }
          : { email };
    const patients = await this.patientRepository.find(
      queryClause
        ? {
            where: email
              ? { account: { email: Like(`%${email}%`) } }
              : queryClause,
          }
        : {},
    );
    return patients.map((patient) =>
      PatientResponseDto.plainToInstance(patient),
    );
  }

  async findOne(id: number) {
    return this.patientRepository.findOne({ where: { id } });
  }

  async findByPhone(phone: string): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepository.find({
      where: { phone: Like(`%${phone}%`) },
      relations: ['account'],
    });
    if (patients && patients.length > 0) {
      return patients.map((patient) => {
        let account = patient.account;
        let patientWithMail = null;
        if (account) {
          patientWithMail = {
            ...patient,
            email: account.email,
          };
        }
        return PatientResponseDto.plainToInstance(patientWithMail || patient);
      });
    } else {
      throw new NotFoundException({
        message: 'Patient not found',
        message_VN: 'Không tìm thấy bệnh nhân',
      });
    }
  }
  async findByFullName(fullName: string): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepository.find({
      where: { fullName: Like(`%${fullName}%`) },
    });
    if (!patients || patients.length === 0) {
      throw new NotFoundException({
        message: 'Patient not found',
        message_VN: 'Không tìm thấy bệnh nhân',
      });
    }
    return patients.map((patient) =>
      PatientResponseDto.plainToInstance(patient),
    );
  }

  async findByPhoneAndName(phone: string, fullName: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { phone, fullName },
    });

    if (!patient) {
      throw new NotFoundException({
        message: 'Patient not found',
        message_VN: 'Không tìm thấy bệnh nhân',
      });
    }
    return patient;
  }

  async create(patient: PatientCreationDto) {
    return this.patientRepository.save(patient);
  }
}
