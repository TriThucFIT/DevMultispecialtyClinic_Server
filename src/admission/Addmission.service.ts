import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ActiveMqService } from 'src/activeMQ/activeMQ.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Registration } from './entities/Registration.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
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
import { log } from 'console';
import { AppointmentStatus } from 'src/appointment/enums/AppointmentStatus.enum';

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
    try {
      let patient: Patient;
      try {
        if (createAdmissionDto.patient) {
          patient = await this.patientService.findByPhoneAndName(
            createAdmissionDto.patient.phone,
            createAdmissionDto.patient.fullName,
          );
        } else {
          throw new EntityNotFoundError(Patient, 'Patient not found');
        }
      } catch (error) {
        if (error.status === 404) {
          patient = await this.patientService.create(
            createAdmissionDto.patient,
          );
        } else throw error;
      }

      let appointment: Appointment;
      if (createAdmissionDto.appointment_id) {
        appointment = await this.appointmentService.findOne(
          createAdmissionDto.appointment_id,
        );

        if (appointment.status === AppointmentStatus.CANCELLED) {
          throw new ConflictException({
            message: 'Appointment has been cancelled',
            message_VN: 'Lịch hẹn đã bị hủy',
          });
        } else if (appointment.status === AppointmentStatus.COMPLETED) {
          throw new ConflictException({
            message: 'Appointment has been completed',
            message_VN: 'Lịch hẹn đã hoàn thành',
          });
        } else {
          await this.appointmentService.updateAppointmentStatus(
            appointment.id,
            AppointmentStatus.CHECKED_IN,
          );
        }
      }

      let serviceType: ServiceType;
      if (createAdmissionDto.service) {
        if (Number(createAdmissionDto.service)) {
          serviceType = await this.serviceTypeService.findOne(
            Number(createAdmissionDto.service),
          );
        } else {
          serviceType = await this.serviceTypeService.findByName(
            String(createAdmissionDto.service),
          );
        }
      } else {
        serviceType = await this.serviceTypeService.findByName('InHour');
      }

      let doctor: Doctor;
      if (createAdmissionDto.doctor_id) {
        doctor = await this.doctorService.findOne(createAdmissionDto.doctor_id);
      }

      let receptionist: Receptionist;
      if (createAdmissionDto.receptionist_useranme) {
        receptionist = await this.receptionistService.findByAccount(
          undefined,
          createAdmissionDto.receptionist_useranme,
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
          seviceType: registration.service?.name || 'InHour',
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
        queueName =
          registration.doctor.specialization.specialization_id +
          '_specialization';
      } else {
        queueName = registration.specialization + '_specialization';
      }

      this.activeMqService.sendMessage(
        queueName,
        JSON.stringify(sendData),
        doctor?.employeeId,
      );
      return registration;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
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
