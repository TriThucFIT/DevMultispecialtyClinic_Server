import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { Doctor } from './entities/doctor.entity';
import { DoctorService } from './doctor.service';
import { Specialization } from './entities/specialization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Specialization])],
  providers: [DoctorService],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export class DoctorModule {}
