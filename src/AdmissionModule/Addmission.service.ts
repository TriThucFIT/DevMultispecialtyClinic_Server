import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ActiveMqService } from 'src/ActiveMQModule/activeMQ.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Registration } from './entities/Registration.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import {
  AcceptEmergency,
  CreateAdmissionDto,
  CreateEmergencyDTO,
  InvoiceSendToQueue,
  PatientSendToQueue,
} from './dto/Admission.dto';
import { AppointmentService } from 'src/AppointmentModule/Appointment.service';
import { PatientService } from 'src/PatientModule/services/patient.service';
import { ServiceTypeService } from 'src/CasherModule/services/ServiceType.service';
import { DoctorService } from 'src/DoctorModule/doctor.service';
import { ReceptionistService } from 'src/ReceptionistModule/receptionist.service';
import { Receptionist } from 'src/ReceptionistModule/entities/receptionist.entity';
import { Doctor } from 'src/DoctorModule/entities/doctor.entity';
import { ServiceType } from 'src/CasherModule/entities/ServiceType.entity';
import { Appointment } from 'src/AppointmentModule/entities/appointment.entity';
import { Patient } from 'src/PatientModule/entities/patient.entity';
import { AppointmentStatus } from 'src/AppointmentModule/enums/AppointmentStatus.enum';
import { AdmissionSattus } from './enums';
import { log } from 'console';
import { plainToClass } from 'class-transformer';
import { InvoiceService } from 'src/CasherModule/services/Invoice.service';
import { InvoiceCreationDTO } from 'src/CasherModule/types/invoice';
import { ItemType } from 'src/CasherModule/enums/itemType.enum';
import { InvoiceStatus } from 'src/CasherModule/enums/InvoiceStatus.enum';

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
    private readonly invoiceService: InvoiceService,
  ) {}

  async createPatientRegistration(createAdmissionDto: CreateAdmissionDto) {
    try {
      let patient: Patient;
      try {
        if (createAdmissionDto.patient) {
          log('createAdmissionDto.patient', createAdmissionDto.patient);
          patient = await this.patientService.updateByPhoneAndName(
            createAdmissionDto.patient.phone,
            createAdmissionDto.patient.fullName,
            createAdmissionDto.patient,
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
          throw new ConflictException('Lịch hẹn đã bị hủy');
        } else if (appointment.status === AppointmentStatus.COMPLETED) {
          throw new ConflictException('Lịch hẹn đã hoàn thành');
        } else {
          this.appointmentService.update({
            ...appointment,
            status: AppointmentStatus.CHECKED_IN,
          });
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

      const addmission = await this.registrationRepository.save({
        ...createAdmissionDto,
        patient,
        appointment,
        service: serviceType,
        doctor,
        receptionist,
      });

      const patientToQueue: Partial<PatientSendToQueue> = {
        id: addmission.patient.patientId,
        fullName: addmission.patient.fullName,
        phone: addmission.patient.phone,
        dob: addmission.patient.dob.toString(),
        age:
          new Date().getFullYear() -
          new Date(addmission.patient.dob).getFullYear(),
        condition: addmission.symptoms,
        priority: this.calculatePriority({
          seviceType: addmission.service?.name || 'InHour',
          dob: addmission.patient.dob,
        }),
        status: addmission.status,
        gender: addmission.patient.gender,
        symptoms: addmission.symptoms,
        address: addmission.patient.address,
        admission: {
          id: addmission.id,
          service: addmission.service.name,
          doctor_id: addmission.doctor?.employeeId,
          specialization:
            addmission.doctor?.specialization?.specialization_id ||
            addmission.specialization,
        },
      };
      let queueName: string;

      if (addmission.service.name === 'EMERGENCY') {
        queueName = 'emergency';
      }
      // else if (addmission.doctor) {
      //   queueName =
      //     addmission.doctor.specialization.specialization_id +
      //     '_specialization';
      // }
      else {
        queueName = 'casher_general';
      }

      const invoice_createtion: InvoiceCreationDTO = {
        patient,
        items: [
          {
            itemType: ItemType.SERVICE,
            name: addmission.service.name,
            amount: addmission.service.price,
            status: InvoiceStatus.PENDING,
          },
        ],
      };

      const invoice = await this.invoiceService.create(invoice_createtion);

      const invoiceToQueue: InvoiceSendToQueue = {
        id: invoice.id,
        total_amount: invoice.total_amount,
        status: invoice.status,
        date: invoice.date,
        patient: patientToQueue,
        items: invoice.invoiceItems.map((item) => ({
          id: item.id,
          name: this.serviceNameMappping[item.name] || item.name,
          status: item.status,
          price: item.amount,
        })),
      };

      const sendData = plainToClass(InvoiceSendToQueue, invoiceToQueue);

      this.activeMqService.sendMessage(
        queueName,
        JSON.stringify(sendData),
        doctor?.employeeId,
      );
      return addmission;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  private serviceNameMappping = {
    Emergency: 'Cấp cứu',
    OutHour: 'Khám ngoài giờ',
    InHour: 'Khám thường',
  };

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

  async createEmergencyRegistration(createEmergencyDTO: CreateEmergencyDTO) {
    try {
      const yearOfBirth = new Date().getFullYear() - createEmergencyDTO.age;
      const patient = await this.patientService.create({
        fullName: createEmergencyDTO.fullName,
        dob: new Date(yearOfBirth, 0, 1),
        priority: 0,
        gender: createEmergencyDTO.gender,
        phone: 'EMERGENCY',
      });

      let serviceType = await this.serviceTypeService.findByName('Emergency');
      if (!serviceType) {
        serviceType = await this.serviceTypeService.create({
          name: 'Emergency',
          price: 0,
          description: 'Cấp cứu',
        });
      }

      const registration = await this.registrationRepository.save({
        status: AdmissionSattus.EMERGENCY,
        isWalkIn: true,
        patient,
        service: serviceType,
        symptoms: createEmergencyDTO.symptoms,
      });

      const sendData: Partial<PatientSendToQueue> = {
        id: registration.id,
        fullName: registration.patient.fullName,
        phone: registration.patient.phone,
        age: createEmergencyDTO.age,
        condition: registration.symptoms,
        priority: this.calculatePriority({
          seviceType: registration.service?.name || 'Emergency',
          dob: registration.patient.dob,
        }),
        status: AdmissionSattus.EMERGENCY,
        gender: registration.patient.gender,
        symptoms: createEmergencyDTO.symptoms,
        address: registration.patient.address,
      };

      this.activeMqService.sendEmergencyMessage(JSON.stringify(sendData));
      return sendData;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async acceptEmergency(acceptEmergency: AcceptEmergency) {
    try {
      log('acceptEmergency', acceptEmergency);
      const doctor = await this.doctorService.findByEmployeeId(
        acceptEmergency.doctor_id,
      );
      const registration = await this.registrationRepository.findOne({
        where: {
          id: acceptEmergency.registration_id,
          status: AdmissionSattus.EMERGENCY,
        },
      });

      if (!doctor) {
        throw new NotFoundException('Không tìm thấy bác sĩ');
      }
      if (!registration) {
        throw new NotFoundException('Không tìm thấy đăng ký khám');
      }

      await this.registrationRepository.update(registration.id, {
        status: AdmissionSattus.IN_PROGRESS,
        doctor,
      });

      const sendDataUpadte = {
        id: registration.id,
        status: AdmissionSattus.IN_PROGRESS,
        doctor_id: doctor.employeeId,
      };
      this.activeMqService.sendEmergencyMessage(JSON.stringify(sendDataUpadte));
      return sendDataUpadte;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
