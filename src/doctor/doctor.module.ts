import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { Doctor } from './entities/doctor.entity';
import { DoctorService } from './doctor.service';
import { DoctorRepository } from './repositories/doctor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  providers: [DoctorService, DoctorRepository],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export class DoctorModule {}
