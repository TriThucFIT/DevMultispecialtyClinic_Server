import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Patient } from 'src/patient/entities/patient.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { ServiceType } from 'src/casher/entities/ServiceType.entity';
import { Receptionist } from 'src/receptionist/entities/receptionist.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@Entity('registration')
export class Registration extends BaseClassProperties {
  @Column({ length: 20 })
  status: string;
  @Column({ type: 'boolean', default: false })
  isWalkIn: boolean;

  @ManyToOne(() => Patient, (patient) => patient.registrations)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
  @ManyToOne(() => Doctor, (doctor) => doctor.registrations)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Receptionist, (receptionist) => receptionist.registrations)
  @JoinColumn({ name: 'receptionist_id' })
  receptionist: Receptionist;

  @ManyToOne(() => Appointment, (appointment) => appointment.registration, {
    nullable: true,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment | null;
  @ManyToOne(() => ServiceType, (service) => service.registrations)
  @JoinColumn({ name: 'service_id' })
  service: ServiceType;
}
