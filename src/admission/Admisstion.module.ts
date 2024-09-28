import { Module } from '@nestjs/common';
import { ActiveMqService } from 'src/activeMQ/activeMQ.service';
import { AdmissionService } from './Addmission.service';
import { AdmissionController } from './Addmission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from './entities/Registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registration])],
  controllers: [AdmissionController],
  providers: [ActiveMqService, AdmissionService],
  exports: [AdmissionService],
})
export class AdmissionModule {}
