import { Module } from '@nestjs/common';
import { ActiveMqService } from 'src/activeMQ/activeMQ.service';
import { AdmissionService } from './Addmission.service';
import { AdmissionController } from './Addmission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from './entities/Registration.entity';
import { PatientModule } from 'src/patient/patient.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { AppointmentModule } from 'src/appointment/Appointment.module';
import { CasherModule } from 'src/casher/casher.module';
import { ReceptionistModule } from 'src/receptionist/receptionist.module';

@Module({
  imports: [
    AppointmentModule,
    PatientModule,
    DoctorModule,
    CasherModule,
    ReceptionistModule,
    TypeOrmModule.forFeature([Registration])],
  controllers: [AdmissionController],
  providers: [ActiveMqService, AdmissionService],
  exports: [AdmissionService],
})
export class AdmissionModule {}
