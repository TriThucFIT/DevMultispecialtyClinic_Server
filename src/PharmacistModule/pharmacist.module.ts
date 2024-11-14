import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacistService } from './pharmacist.service';
import { PharmacistController } from './controllers/pharmacist.controller';
import { Pharmacist } from './entities/pharmacist.entity';
import { Medication } from './entities/Medication.entity';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionMedication } from './entities/prescriptionMedication.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pharmacist,
      Medication,
      PrescriptionMedication,
      Prescription,
    ]),
  ],
  providers: [
    PharmacistService,
    PharmacistController,
    Medication,
    Prescription,
    PrescriptionMedication,
    Pharmacist,
  ],
  controllers: [PharmacistController],
  exports: [
    PharmacistService,
    PharmacistController,
    Medication,
    Prescription,
    PrescriptionMedication,
    Pharmacist,
  ],
})
export class PharmacistModule {}
