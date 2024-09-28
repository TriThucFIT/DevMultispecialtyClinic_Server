import { Registration } from 'src/admission/entities/Registration.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Employee } from 'src/auth/entities/employee.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('doctor')
export class Doctor extends Employee {
  @Column({
    length: 50,
  })
  specialization: string;
  @Column({
    length: 20,
  })
  qualification: string;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
  @OneToMany(() => Registration, (registration) => registration.patient)
  registrations: Registration[];
}
