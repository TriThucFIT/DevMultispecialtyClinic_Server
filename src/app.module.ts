import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ActiveMQModule } from './activeMQ/avtiveMQ.module';
import { AdmissionModule } from './admission/Admisstion.module';
import { AppService } from './app.service';
import { CasherModule } from 'src/casher/casher.module';
import { ReceptionistModule } from './receptionist/receptionist.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/Appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { LabTestModule } from './labTest/labTest.module';
import { PharmacistModule } from './pharmacist/pharmacist.module';

@Module({
  imports: [
    ActiveMQModule,
    AdmissionModule,
    AppointmentModule,
    AuthModule,
    CasherModule,
    DoctorModule,
    LabTestModule,
    PatientModule,
    PharmacistModule,
    ReceptionistModule,

    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      dropSchema: false,
    }),
  ],
  providers: [AppService, AuthModule, ActiveMQModule, AdmissionModule],
})
export class AppModule {}
