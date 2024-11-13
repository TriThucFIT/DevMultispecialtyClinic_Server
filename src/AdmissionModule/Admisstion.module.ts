import { Module } from '@nestjs/common';
import { ActiveMqService } from 'src/ActiveMQModule/activeMQ.service';
import { AdmissionService } from './Addmission.service';
import { AdmissionController } from './Addmission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from './entities/Registration.entity';
import { PatientModule } from 'src/PatientModule/patient.module';
import { DoctorModule } from 'src/DoctorModule/doctor.module';
import { AppointmentModule } from 'src/AppointmentModule/Appointment.module';
import { CasherModule } from 'src/CasherModule/casher.module';
import { ReceptionistModule } from 'src/ReceptionistModule/receptionist.module';

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
