import {
  ConflictException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  AvailableAppointments,
  CreateAppointmentDto,
} from './dto/Appoitment.dto';
import { Appointment } from './entities/appointment.entity';
import { DoctorService } from 'src/DoctorModule/doctor.service';
import { ServiceTypeService } from 'src/CasherModule/services/ServiceType.service';
import { PatientService } from 'src/PatientModule/services/patient.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentStatus } from './enums/AppointmentStatus.enum';
import { MedicalRecordService } from 'src/PatientModule/services/MedicalRecod.service';
import { CustomMailerService } from 'src/MailerModule/MailerModule.service';
import { AppointmentComfirmation } from 'src/MailerModule/types';
import { log } from 'console';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    private readonly serviceTypeType: ServiceTypeService,
    private readonly medicalRecordService: MedicalRecordService,
    private readonly mailService: CustomMailerService,
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

  async findByPatients(
    username?: string,
    phone?: string,
    fullName?: string,
    email?: string,
  ) {
    const queryClause = phone ? { phone } : fullName ? { fullName } : { email };
    const appointments = await this.appointmentRepository.find({
      where: {
        patient: username
          ? { account: { username } }
          : email
            ? { account: { email } }
            : queryClause,
      },
      relations: [
        'doctor',
        'service',
        'patient',
        'patient.account',
        'doctor.specialization',
      ],
      select: this.SelectAppointmentFields,
      order: { date: 'DESC' },
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
    log('Date', date);
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

  async getAvailableAppointments(
    date: Date,
    specializationId: string,
  ): Promise<AvailableAppointments> {
    const doctors =
      await this.doctorService.findBySpecialization(specializationId);

    log('Date', date, 'Specialization', specializationId);
    const doctorAvailableSlots = await Promise.all(
      doctors.map(async (doctor) => {
        log('doctor', doctor.fullName, 'ID', doctor.id);
        const appointments = await this.appointmentRepository.find({
          where: {
            doctor: { id: doctor.id },
            date,
            status: AppointmentStatus.SCHEDULED,
          },
        });

        const availableSlots = this.calculateAvailableTimes(appointments);
        return {
          id: doctor.id,
          name: doctor.fullName,
          availableSlots,
        };
      }),
    );

    return {
      date,
      specialization: {
        id: specializationId,
        name: doctors[0]?.specialization?.name || 'Unknown',
      },
      doctor: doctorAvailableSlots,
    };
  }

  private calculateAvailableTimes(appointments: Appointment[]): string[] {
    const workingHours = { start: '08:00', end: '20:00' };
    const timeInterval = 30;
    const maxAppointments = 10;

    const takenTimesInMinutes = appointments.map((appt) =>
      this.timeToMinutes(appt.time),
    );

    const availableTimes: string[] = [];
    let currentTimeInMinutes = this.timeToMinutes(workingHours.start);
    const endTimeInMinutes = this.timeToMinutes(workingHours.end);

    while (currentTimeInMinutes < endTimeInMinutes) {
      const isTimeAvailable =
        takenTimesInMinutes.filter(
          (takenTime) =>
            Math.abs(currentTimeInMinutes - takenTime) < timeInterval,
        ).length === 0;

      if (isTimeAvailable && appointments.length < maxAppointments) {
        availableTimes.push(this.minutesToTime(currentTimeInMinutes));
      }

      currentTimeInMinutes += timeInterval;
    }

    return availableTimes;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  async create(appointment: CreateAppointmentDto) {
    try {
      const apm = new Appointment();
      if (appointment.doctor) {
        const doctor = await this.doctorService.findByNameAndSpecialty(
          appointment.doctor.name,
          appointment.doctor.specialization,
        );

        if (doctor) {
          apm.doctor = doctor;
        } else {
          throw new NotFoundException('Không tìm thấy bác sĩ');
        }
      }
      if (appointment.service) {
        const serviceType = await this.serviceTypeType.findByName(
          appointment.service,
        );

        if (serviceType) {
          apm.service = serviceType;
        } else {
          throw new NotFoundException('Không tìm thấy dịch vụ');
        }
      }
      try {
        const patient = await this.patientService.updateByPhoneAndName(
          appointment.patient.phone,
          appointment.patient.fullName,
          appointment.patient,
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
        const newPatient = await this.patientService.create(
          appointment.patient,
        );
        apm.patient = newPatient;
      }
      apm.date = appointment.date;
      apm.time = appointment.time;
      apm.symptoms = appointment.symptoms;

      const newAppointment = await this.appointmentRepository.save(apm);
      if (appointment.medicalRecordEntryId) {
        const medicalRecordEntry =
          await this.medicalRecordService.findRecordEntry(
            appointment.medicalRecordEntryId,
          );
        if (medicalRecordEntry) {
          medicalRecordEntry.appointment = newAppointment;
          await this.medicalRecordService.saveRecordEntry(medicalRecordEntry);
        }
      }
      log(newAppointment);

      if (newAppointment.patient?.account?.email || appointment.patient.email) {
        const confirmation_mail: AppointmentComfirmation = {
          id: newAppointment.id,
          date: new Date(newAppointment.date).toLocaleDateString('vi-VN'),
          time: newAppointment.time,
          doctor: {
            fullName: newAppointment.doctor?.fullName,
            phone: newAppointment.doctor?.phone,
            specialization: newAppointment.doctor?.specialization?.name,
          },
          isWalkIn: newAppointment.isWalkIn,
          status: newAppointment.status,
          symptoms: newAppointment.symptoms,
          service: {
            id: newAppointment.service?.id,
            name: newAppointment.service?.description,
            price: newAppointment.service?.price,
          },
          patient: {
            id: newAppointment.patient?.patientId,
            fullName: newAppointment.patient?.fullName,
            address: {
              city: newAppointment.patient?.address?.city,
              state: newAppointment.patient?.address?.state,
              address: newAppointment.patient?.address?.address,
            },
            phone: newAppointment.patient?.phone,
            age: newAppointment.patient?.age,
            dob: newAppointment.patient?.dob
              ? new Date(newAppointment.patient?.dob).toLocaleDateString(
                  'vi-VN',
                )
              : '',
            gender: newAppointment.patient?.gender,
            priority: newAppointment.patient?.priority,
            email:
              newAppointment.patient?.account?.email ??
              appointment.patient.email,
          },
        };

        await this.mailService.sendAppointmentConfirmation(
          confirmation_mail.patient.email,
          confirmation_mail,
        );
      }

      return newAppointment;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async cancelAppointment(id: number) {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
      });
      if (appointment && appointment.status === AppointmentStatus.CANCELLED) {
        throw new ConflictException('Lịch hẹn đã được hủy');
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
        throw new NotFoundException('Không tìm thấy lịch hẹn');
      }
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async updateAppointmentStatusById(id: number, status: AppointmentStatus) {
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
        throw new NotFoundException('Không tìm thấy lịch hẹn');
      }
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async delete(id: number) {
    return this.appointmentRepository.delete(id);
  }

  async update(appointment: Appointment) {
    return this.appointmentRepository.update(
      appointment.id as number,
      appointment,
    );
  }
}
