import { Injectable } from '@nestjs/common';
import { ActiveMqService } from 'src/activeMQ/activeMQ.service';
import { PatientRegistration } from './Admission.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Registration } from './entities/Registration.entity';
import { Repository } from 'typeorm';
import { CreateAdmissionDto, PatientSendToQueue } from './dto/Admission.dto';
import { AppointmentService } from 'src/appointment/Appointment.service';
import { PatientService } from 'src/patient/patient.service';
import { ServiceTypeService } from 'src/casher/services/ServiceType.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { ReceptionistService } from 'src/receptionist/receptionist.service';
import { Receptionist } from 'src/receptionist/entities/receptionist.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { ServiceType } from 'src/casher/entities/ServiceType.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Injectable()
export class AdmissionService {
  constructor(
    private readonly activeMqService: ActiveMqService,

    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
    private readonly appointmentService: AppointmentService,
    private readonly patientService: PatientService,
    private readonly serviceTypeService: ServiceTypeService,
    private readonly doctorService: DoctorService,
    private readonly receptionistService: ReceptionistService,
  ) {}

  async createPatientRegistration(createAdmissionDto: CreateAdmissionDto) {
    let patient: Patient;
    if (createAdmissionDto.patient) {
      patient = await this.patientService.findByPhone(
        createAdmissionDto.patient.phone,
      );
    }
    if (!patient) {
      patient = await this.patientService.create(createAdmissionDto.patient);
    }

    let appointment: Appointment;
    if (createAdmissionDto.appointment_id) {
      appointment = await this.appointmentService.findOne(
        createAdmissionDto.appointment_id,
      );
    }

    let serviceType: ServiceType;
    if (createAdmissionDto.service) {
      serviceType = await this.serviceTypeService.findOne(
        createAdmissionDto.service,
      );
    }

    let doctor: Doctor;
    if (createAdmissionDto.doctor_id) {
      doctor = await this.doctorService.findOne(createAdmissionDto.doctor_id);
    }

    let receptionist: Receptionist;
    if (createAdmissionDto.receptionist_phone) {
      receptionist = await this.receptionistService.findByPhone(
        createAdmissionDto.receptionist_phone,
      );
    }

    const registration = await this.registrationRepository.save({
      ...createAdmissionDto,
      patient,
      appointment,
      service: serviceType,
      doctor,
      receptionist,
    });

    const sendData: PatientSendToQueue = {
      id: registration.id,
      fullName: registration.patient.fullName,
      phone: registration.patient.phone,
      dob: registration.patient.dob.toString(),
      age:
        new Date().getFullYear() -
        new Date(registration.patient.dob).getFullYear(),
      condition: registration.symptoms,
      priority: this.calculatePriority({
        seviceType: registration.service.name,
        dob: registration.patient.dob,
      }),
      status: registration.status,
      gender: registration.patient.gender,
      symptoms: registration.symptoms,
      address: registration.patient.address,
    };
    let queueName: string;
    if (registration.service.name === 'EMERGENCY') {
      queueName = 'emergency';
    } else if (registration.doctor) {
      queueName = registration.doctor.specialization + '_specialization';
    } else {
      queueName = 'general';
    }

    this.activeMqService.sendMessage(queueName, JSON.stringify(sendData));
    return registration;
  }

  private calculatePriority(patient: any): number {
    if (patient.seviceType === 'EMERGENCY') {
      return 0;
    }

    if (patient.seviceType === 'OVERTIME') {
      return 1;
    }

    const currentYear = new Date().getFullYear();
    const birthYear = new Date(patient.dob).getFullYear();
    const age = currentYear - birthYear;

    if (age >= 80) {
      return 2;
    }

    return 3;
  }
}
