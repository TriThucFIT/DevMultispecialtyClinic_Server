import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentService } from './Appointment.service';
import { AppointmentController } from './Appointment.controller';
import { DoctorModule } from 'src/DoctorModule/doctor.module';
import { PatientModule } from 'src/PatientModule/patient.module';
import { AdmissionModule } from 'src/AdmissionModule/Admisstion.module';
import { AppointmentRepository } from './repositories/appointment.repository';
import { CasherModule } from 'src/CasherModule/casher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    DoctorModule,
    PatientModule,
    CasherModule,
  ],
  providers: [AppointmentService, AppointmentRepository],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}