import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabTestController } from './labTest.controller';
import { LabTestService } from './labTest.service';
import { LabTest } from './entities/LabTest.entity';
import { TestResult } from './entities/TestResult.entity';
import { LabRequest } from './entities/LabRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LabTest, TestResult, LabRequest])],
  providers: [LabTestService],
  controllers: [LabTestController],
  exports: [LabTestService],
})
export class LabTestModule {}
