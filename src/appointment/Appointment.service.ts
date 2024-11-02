import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/Appoitment.dto';
import { Appointment } from './entities/appointment.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { ServiceTypeService } from 'src/casher/services/ServiceType.service';
import { PatientService } from 'src/patient/patient.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { log } from 'console';
import { AppointmentStatus } from './enums/AppointmentStatus.enum';

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

  private SelectAppointmentFields = {
    id: true,
    date: true,
    time: true,
    symptoms: true,
    isWalkIn: true,
    status: true,
    patient: {
      id: true,
      fullName: true,
      phone: true,
      dob: true,
      priority: true,
      gender: true,
      address: {
        address: true,
        city: true,
        state: true,
        country: true,
      },
      account: {
        email: true,
      },
    },
    service: {
      id: true,
      name: true,
      price: true,
    },
    doctor: {
      id: true,
      fullName: true,
      employeeId: true,
      specialization: {
        name: true,
        specialization_id: true,
      },
    },
  };

  async findByPatients(phone?: string, fullName?: string, email?: string) {
    const queryClause = phone ? { phone } : fullName ? { fullName } : { email };
    const appointments = await this.appointmentRepository.find({
      where: { patient: email ? { account: { email } } : queryClause },
      relations: [
        'doctor',
        'service',
        'patient',
        'patient.account',
        'doctor.specialization',
      ],
      select: this.SelectAppointmentFields,
    });

    return appointments.map((apm) => {
      const reps = {
        ...apm,
        patient: {
          ...apm.patient,
          email: apm.patient.account?.email,
        },
      };
      delete reps.patient.account;
      return reps;
    });
  }
  async findByDate(date: Date) {
    log('date', date);
    const appointments = await this.appointmentRepository.find({
      where: { date },
      relations: [
        'doctor',
        'service',
        'patient',
        'patient.account',
        'doctor.specialization',
      ],
      select: this.SelectAppointmentFields,
    });

    return appointments.map((apm) => {
      const reps = {
        ...apm,
        patient: {
          ...apm.patient,
          email: apm.patient.account?.email,
        },
      };
      delete reps.patient.account;
      return reps;
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
      const patient = await this.patientService.updateByPhoneAndName(
        appointment.patient.phone,
        appointment.patient.fullName,
        appointment.patient
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

  async cancelAppointment(id: number) {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
      });
      if (appointment && appointment.status === AppointmentStatus.CANCELLED) {
        throw new ConflictException({
          message: 'Appointment already cancelled',
          message_VN: 'Lịch hẹn đã được hủy',
        });
      }
      if (appointment) {
        appointment.status = AppointmentStatus.CANCELLED;
        const result = await this.appointmentRepository.save(appointment);
        return {
          message: 'Appointment cancelled successfully',
          message_VN: 'Hủy lịch hẹn thành công',
          data: result.status,
        };
      } else {
        throw new NotFoundException({
          message: 'Appointment not found',
          message_VN: 'Không tìm thấy lịch hẹn',
        });
      }
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async updateAppointmentStatus(id: number, status: AppointmentStatus) {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
      });
      if (appointment) {
        appointment.status = status;
        const result = await this.appointmentRepository.save(appointment);
        return {
          message: 'Appointment status updated successfully',
          message_VN: 'Cập nhật trạng thái lịch hẹn thành công',
          data: result.status,
        };
      } else {
        throw new NotFoundException({
          message: 'Appointment not found',
          message_VN: 'Không tìm thấy lịch hẹn',
        });
      }
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
