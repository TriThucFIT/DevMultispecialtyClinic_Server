import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from './entities/ServiceType.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoiceItem.entity';
import { Casher } from './entities/casher.entity';
import { PharmacistModule } from 'src/PharmacistModule/pharmacist.module';
import { ServiceTypeService } from './services/ServiceType.service';
import { CasherService } from './services/Casher.service';
import { PatientModule } from 'src/PatientModule/patient.module';

@Module({
  imports: [
    PharmacistModule,
    PatientModule,
    TypeOrmModule.forFeature([ServiceType, Invoice, InvoiceItem, Casher]),
  ],
  controllers: [],
  providers: [
    ServiceType,
    Invoice,
    InvoiceItem,
    Casher,
    ServiceTypeService,
    CasherService,
  ],
  exports: [
    ServiceTypeService,
    CasherService,
  ],
})
export class CasherModule {}
