import { Registration } from 'src/AdmissionModule/entities/Registration.entity';
import { Appointment } from 'src/AppointmentModule/entities/appointment.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Specialization } from './specialization.entity';
import { Employee } from 'src/AuthenticationModule/entities/employee.entity';

@Entity('doctor')
export class Doctor extends Employee {
  @ManyToOne(() => Specialization, (specialization) => specialization.doctors)
  @JoinColumn({ name: 'specialization_id' })
  specialization: Specialization;
  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
  @OneToMany(() => Registration, (registration) => registration.patient)
  registrations: Registration[];
}
