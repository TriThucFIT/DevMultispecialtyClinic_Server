import { Registration } from 'src/admission/entities/Registration.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Employee } from 'src/auth/entities/employee.entity';
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
