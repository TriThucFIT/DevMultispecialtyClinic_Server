import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceptionistController } from './receptionist.controller';
import { ReceptionistService } from './receptionist.service';
import { Receptionist } from './entities/receptionist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Receptionist])],
  providers: [ReceptionistService],
  controllers: [ReceptionistController],
  exports: [ReceptionistService],
})
export class ReceptionistModule {}
