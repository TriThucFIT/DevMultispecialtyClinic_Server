import { Registration } from 'src/admission/entities/Registration.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('service')
export class ServiceType extends BaseClassProperties {
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  price: number;
  @OneToMany(
    () => Registration,
    (registration: Registration) => registration.receptionist,
  )
  registrations: Registration[];
  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
