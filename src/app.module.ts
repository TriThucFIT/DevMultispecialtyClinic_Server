import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ActiveMQModule } from './ActiveMQModule/avtiveMQ.module';
import { AdmissionModule } from './AdmissionModule/Admisstion.module';
import { AppService } from './app.service';
import { CasherModule } from 'src/CasherModule/casher.module';
import { ReceptionistModule } from './ReceptionistModule/receptionist.module';
import { PatientModule } from './PatientModule/patient.module';
import { AppointmentModule } from './AppointmentModule/Appointment.module';
import { DoctorModule } from './DoctorModule/doctor.module';
import { LabTestModule } from './LabTestModule/labTest.module';
import { PharmacistModule } from './PharmacistModule/pharmacist.module';
import { dataSourceOptions } from './Database/data-source';
import { AuthModule } from './AuthenticationModule/auth.module';

@Module({
  imports: [
    ActiveMQModule,
    AppointmentModule,
    PatientModule,
    AdmissionModule,
    AuthModule,
    CasherModule,
    DoctorModule,
    LabTestModule,
    PharmacistModule,
    ReceptionistModule,

    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  providers: [AppService, AuthModule, ActiveMQModule, AdmissionModule],
})
export class AppModule {}
