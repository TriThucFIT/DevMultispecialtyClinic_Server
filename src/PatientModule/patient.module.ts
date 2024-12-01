import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './services/patient.service';
import { Patient } from './entities/patient.entity';
import { MedicalInformation } from './entities/MedicalInformation.entity';
import { MedicalRecord } from './entities/MedicalRecord.entity';
import { Feedback } from './entities/feedback.entity';
import { PatientRepository } from './repositories/patient.repository';
import { PatientController } from './controllers/patient.controller';
import { MedicalRecordService } from './services/MedicalRecod.service';
import { MedicalRecordEntry } from './entities/MedicalRecordEntry.entity';
import { DoctorModule } from 'src/DoctorModule/doctor.module';
import { MedicalRecordController } from './controllers/MedicalRecord.controller';
import { CasherModule } from 'src/CasherModule/casher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      MedicalInformation,
      MedicalRecord,
      MedicalRecordEntry,
      Feedback,
    ]),
    DoctorModule,
  ],
  providers: [
    PatientService,
    PatientRepository,
    Patient,
    MedicalRecordService,
    MedicalInformation,
    MedicalRecordEntry,
  ],
  controllers: [PatientController, MedicalRecordController],
  exports: [PatientService, Patient, MedicalRecordService],
})
export class PatientModule {}
