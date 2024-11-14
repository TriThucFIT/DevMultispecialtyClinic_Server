import { MedicalInformation } from './MedicalInformation.entity';
import { AfterLoad, Column, Entity, OneToMany } from 'typeorm';
import { Registration } from 'src/AdmissionModule/entities/Registration.entity';
import { Appointment } from 'src/AppointmentModule/entities/appointment.entity';
import { User } from 'src/AuthenticationModule/entities/user.entity';

@Entity('patient')
export class Patient extends User {
  @Column({
    type: 'int',
    nullable: false,
    default: 3,
  })
  priority: number;
  age: number;
  @Column({ unique: true,
    default: 'PAT0' + Math.floor(Math.random() * 1000000) + 1,
   })
  patientId: string;
  @OneToMany(
    () => MedicalInformation,
    (medicalInformation) => medicalInformation.id,
  )
  medicalInformation: MedicalInformation[];
  @OneToMany(() => Registration, (registration) => registration.patient)
  registrations: Registration[];
  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @AfterLoad()
  calculateAge() {
    if (this.dob) {
      const currentDate = new Date();
      const birthDate = new Date(this.dob);
      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = currentDate.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      this.age = age;
    }
  }
}
