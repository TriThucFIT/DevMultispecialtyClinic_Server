import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentService } from './Appointment.service';
import { AppointmentController } from './Appointment.controller';
import { DoctorModule } from 'src/doctor/doctor.module';
import { PatientModule } from 'src/patient/patient.module';
import { AdmissionModule } from 'src/admission/Admisstion.module';
import { AppointmentRepository } from './repositories/appointment.repository';
import { CasherModule } from 'src/casher/casher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    DoctorModule,
    PatientModule,
    AdmissionModule,
    CasherModule,
  ],
  providers: [AppointmentService, AppointmentRepository],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}
