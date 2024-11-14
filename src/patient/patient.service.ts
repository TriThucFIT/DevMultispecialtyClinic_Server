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
          }
        : {},
    );

    return patients.map((patient) =>
      PatientResponseDto.plainToInstance(patient),
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
      throw new NotFoundException({
        message: 'Không tìm thấy bệnh nhân',
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

  async findPatientLastest(): Promise<Patient> {
    const patients = await this.patientRepository.find({
      order: {
        id: 'DESC',
      },
      take: 1,
    });
    return patients[0];
  }

  async create(patient: PatientCreationDto) {
    const patientNew = new Patient();
    Object.assign(patientNew, patient);

    const findPatient = await this.findPatientLastest();
    if (findPatient) {
      const patientId = parseInt(findPatient.patientId.slice(4)) + 1;
      patientNew.patientId = `PAT0${patientId}`;
    } else {
      patientNew.patientId = `PAT01`;
    }

    return this.patientRepository.save(patientNew);
  }

  async update(id: number, patient: PatientCreationDto) {
    const patientToUpdate = await this.patientRepository.findOne({
      where: { id },
    });
    if (!patientToUpdate) {
      throw new NotFoundException({
        message: 'Patient not found',
        message_VN: 'Không tìm thấy bệnh nhân',
      });
    }
    return this.patientRepository.save({ ...patientToUpdate, ...patient });
  }

  async updateByPhoneAndName(
    phone: string,
    fullName: string,
    patient: PatientCreationDto,
  ) {
    const patientToUpdate = await this.findByPhoneAndName(phone, fullName);
    if (!patientToUpdate) {
      throw new NotFoundException({
        message: 'Patient not found',
        message_VN: 'Không tìm thấy bệnh nhân',
      });
    }
    return this.patientRepository.save({
      ...patientToUpdate,
      account: { email: patient.email },
      ...patient,
    });
  }
}
