import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabTestController } from './labTest.controller';
import { LabTestService } from './labTest.service';
import { LabTest } from './entities/LabTest.entity';
import { TestResult } from './entities/TestResult.entity';
import { LabRequest } from './entities/LabRequest.entity';
import { PatientModule } from 'src/PatientModule/patient.module';
import { DoctorModule } from 'src/DoctorModule/doctor.module';
import { LabTestCategory } from './entities/LabTestCategory.entity';
import { CasherModule } from 'src/CasherModule/casher.module';
import { GenerateTestResult } from './ultil/GenerateTestResult.ultil';

@Module({
  imports: [
    PatientModule,
    DoctorModule,
    CasherModule,
    TypeOrmModule.forFeature([
      LabTest,
      TestResult,
      LabRequest,
      LabTestCategory,
    ]),
  ],
  providers: [LabTestService, GenerateTestResult],
  controllers: [LabTestController],
  exports: [LabTestService, GenerateTestResult],
})
export class LabTestModule {}
