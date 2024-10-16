import { Registration } from 'src/admission/entities/Registration.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Employee } from 'src/auth/entities/employee.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Specialization } from './specialization.entity';

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
