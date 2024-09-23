import { Module } from '@nestjs/common';
import { ActiveMqService } from 'src/activeMQ/activeMQ.service';
import { AdmissionService } from './Addmission.service';
import { AdmissionController } from './Addmission.controller';

@Module({
  imports: [],
  controllers: [AdmissionController],
  providers: [ActiveMqService, AdmissionService],
  exports: [AdmissionService],
})
export class AdmissionModule {}
