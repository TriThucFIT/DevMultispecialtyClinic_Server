import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PatientCreationDto,
  PatientResponseDto,
  PatientUpdateDto,
} from '../dto/patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { Like, Repository } from 'typeorm';
import { log } from 'console';

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
    patientId?: string,
  ): Promise<PatientResponseDto[]> {
    const queryClause = patientId
      ? { patientId }
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

            relations: ['account'],

            select: {
              patientId: true,
              fullName: true,
              gender: true,
              phone: true,
              dob: true,
              priority: true,
              address: {
                address: true,
                city: true,
                state: true,
              },
              account: {
                email: true,
              },
            },
          }
        : {},
    );
    return patients.map((patient) =>
      PatientResponseDto.plainToInstance({
        ...patient,
        email: patient.account?.email,
      }),
    );
  }

  async findOne(patientId: string): Promise<Patient> {
    const patients = await this.patientRepository.findOne({
      where: { patientId },
      relations: ['account'],
    });
    return patients;
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
            accountId: account.id,
          };
        }
        return PatientResponseDto.plainToInstance(patientWithMail || patient);
      });
    } else {
      throw new NotFoundException('Không tìm thấy bệnh nhân');
    }
  }
  async findByFullName(fullName: string): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepository.find({
      where: { fullName: Like(`%${fullName}%`) },
      relations: ['account'],
    });
    if (!patients || patients.length === 0) {
      throw new NotFoundException('Không tìm thấy bệnh nhân');
    }
    return patients.map((patient) =>
      PatientResponseDto.plainToInstance(patient),
    );
  }

  async findByPhoneAndName(phone: string, fullName: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { phone, fullName },
      relations: ['account'],
    });

    if (!patient) {
      throw new NotFoundException('Không tìm thấy bệnh nhân');
    }
    return patient;
  }

  async findPatientLastest(): Promise<Patient> {
    const patients = await this.patientRepository.find({
      order: {
        id: 'DESC',
      },
      take: 1,
    });
    return patients[0];
  }

  async findByAccount(accountId: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { account: { id: accountId } },
    });
    if (!patient) {
      throw new NotFoundException('Không tìm thấy bệnh nhân');
    }
    return patient;
  }

  async create(patient: PatientCreationDto) {
    const patientNew = new Patient();
    Object.assign(patientNew, patient);
    const lastestPatient = await this.findPatientLastest();
    patientNew.id = (lastestPatient?.id || 0) + 1;
    patientNew.patientId = `PAT0${patientNew.id || 1}`;
    return this.patientRepository.save(patientNew);
  }

  async update(id: number | string, patient: Partial<PatientUpdateDto>) {
    const patientToUpdate = await this.patientRepository.findOne({
      where: typeof id === 'string' ? { patientId: id } : { id },
      relations: ['account'],
    });
    if (!patientToUpdate) {
      throw new NotFoundException('Không tìm thấy bệnh nhân');
    }
    return this.patientRepository.save({
      ...patientToUpdate,
      ...patient,
      account: { email: patient?.email ?? patientToUpdate.account?.email },
    });
  }

  async updateByPhoneAndName(
    phone: string,
    fullName: string,
    patient: PatientCreationDto,
  ) {
    log('updateByPhoneAndName', patient);
    const patientToUpdate = await this.findByPhoneAndName(phone, fullName);
    if (!patientToUpdate) {
      throw new NotFoundException('Không tìm thấy bệnh nhân');
    }
    return this.patientRepository.save({
      ...patientToUpdate,
      account: { email: patient.email },
      ...patient,
    });
  }
}
