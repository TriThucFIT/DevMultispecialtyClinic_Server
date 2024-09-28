import { Registration } from 'src/admission/entities/Registration.entity';
import { ServiceType } from 'src/casher/entities/ServiceType.entity';
import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Receptionist } from 'src/receptionist/entities/receptionist.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AppointmentStatus } from '../enums/AppointmentStatus.enum';

@Entity('appointment')
export class Appointment extends BaseClassProperties {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: Date;

  @Column({ type: 'time', nullable: true })
  checkInTime: Date | null;

  @Column('enum', {
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => ServiceType, (service) => service.appointments)
  @JoinColumn({ name: 'service_id' })
  service: ServiceType;

  @ManyToOne(() => Receptionist, (receptionist) => receptionist.appointments)
  @JoinColumn({ name: 'receptionist_id' })
  receptionist: Receptionist;

  @OneToOne(() => Registration, (registration) => registration.appointment)
  registration: Registration;
}
