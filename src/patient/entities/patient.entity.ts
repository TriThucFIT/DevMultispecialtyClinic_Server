import { User } from 'src/auth/entities/user.entity';
import { MedicalInformation } from './MedicalInformation.entity';
import { AfterLoad, Column, Entity, OneToMany } from 'typeorm';
import { Registration } from 'src/admission/entities/Registration.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Entity('patient')
export class Patient extends User {
  @Column()
  priority: number;
  @Column({
    type: 'int',
    nullable: true,
  })
  age: number;
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
