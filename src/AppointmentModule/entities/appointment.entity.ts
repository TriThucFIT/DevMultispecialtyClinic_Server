import { Registration } from 'src/AdmissionModule/entities/Registration.entity';
import { ServiceType } from 'src/CasherModule/entities/ServiceType.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Doctor } from 'src/DoctorModule/entities/doctor.entity';
import { Patient } from 'src/PatientModule/entities/patient.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AppointmentStatus } from '../enums/AppointmentStatus.enum';

@Entity('appointment')
export class Appointment extends BaseClassProperties {
  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'time', nullable: true })
  checkInTime: Date | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  isWalkIn: boolean;

  @Column('enum', {
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => ServiceType, (service) => service.appointments)
  @JoinColumn({ name: 'service_id' })
  service: ServiceType;

  @OneToOne(() => Registration, (registration) => registration.appointment)
  registration: Registration;
}
