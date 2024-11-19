import { Registration } from 'src/AdmissionModule/entities/Registration.entity';
import { Appointment } from 'src/AppointmentModule/entities/appointment.entity';
import { Employee } from 'src/AuthenticationModule/entities/employee.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('Receptionist')
export class Receptionist extends Employee {
  constructor() {
    super();
  }

  @OneToMany(
    () => Registration,
    (registration: Registration) => registration.receptionist,
  )
  registrations: Registration[];
  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
