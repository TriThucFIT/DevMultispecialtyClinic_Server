import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { Patient } from './entities/patient.entity';
import { MedicalInformation } from './entities/MedicalInformation.entity';
import { MedicalRecord } from './entities/MedicalRecord.entity';
import { Feedback } from './entities/feedback.entity';
import { PatientRepository } from './repositories/patient.repository';
import { PatientController } from './controllers/patient.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      MedicalInformation,
      MedicalRecord,
      Feedback,
    ]),
  ],
  providers: [PatientService, PatientRepository],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}
