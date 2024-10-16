import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/Appoitment.dto';
import { Appointment } from './entities/appointment.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { ServiceTypeService } from 'src/casher/services/ServiceType.service';
import { PatientService } from 'src/patient/patient.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { log } from 'console';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    private readonly serviceTypeType: ServiceTypeService,
  ) {}

  async findAll() {
    return this.appointmentRepository.find();
  }

  async findOne(id: number) {
    return this.appointmentRepository.findOne({ where: { id } });
  }

  async findByPatientPhone(phone: string) {
    return this.appointmentRepository.findOne({
      where: { patient: { phone } },
      relations: ['doctor', 'service', 'patient'],
    });
  }

  async create(appointment: CreateAppointmentDto) {
    const apm = new Appointment();

    if (appointment.doctor) {
      const doctor = await this.doctorService.findByNameAndSpecialty(
        appointment.doctor.name,
        appointment.doctor.specialization,
      );

      if (doctor) {
        apm.doctor = doctor;
      } else {
        throw new Error('Doctor not found');
      }
    }
    if (appointment.service) {
      const serviceType = await this.serviceTypeType.findByName(
        appointment.service,
      );

      if (serviceType) {
        apm.service = serviceType;
      } else {
        throw new Error('Service type not found');
      }
    }
    try {
      const patient = await this.patientService.findByPhoneAndName(
        appointment.patient.phone,
        appointment.patient.fullName,
      );
      if (patient) {
        apm.patient = patient;
      } else {
        const newPatient = await this.patientService.create(
          appointment.patient,
        );
        apm.patient = newPatient;
      }
    } catch (error) {
      const newPatient = await this.patientService.create(appointment.patient);
      apm.patient = newPatient;
    }
    apm.date = appointment.date;
    apm.time = appointment.time;
    apm.symptoms = appointment.symptoms;

    return this.appointmentRepository.save(apm);
  }
}
