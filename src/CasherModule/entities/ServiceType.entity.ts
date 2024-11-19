<<<<<<< HEAD:src/casher/entities/ServiceType.entity.ts
import { Registration } from 'src/admission/entities/Registration.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
=======
import { Registration } from 'src/AdmissionModule/entities/Registration.entity';
import { Appointment } from 'src/AppointmentModule/entities/appointment.entity';
>>>>>>> 2ed803faf176af1a2b6ef2f3117e0ff22b1c3a92:src/CasherModule/entities/ServiceType.entity.ts
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
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
