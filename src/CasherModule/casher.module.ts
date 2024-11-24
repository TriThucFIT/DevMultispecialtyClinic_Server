import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from './entities/ServiceType.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoiceItem.entity';
import { Casher } from './entities/casher.entity';
import { PharmacistModule } from 'src/PharmacistModule/pharmacist.module';
import { ServiceTypeService } from './services/ServiceType.service';
import { PatientModule } from 'src/PatientModule/patient.module';
import { InvoiceService } from './services/Invoice.service';
import { CasherController } from './controllers/Casher.controller';
import { CasherService } from './casher.service';

@Module({
  imports: [
    PharmacistModule,
    PatientModule,
    TypeOrmModule.forFeature([ServiceType, Invoice, InvoiceItem, Casher]),
  ],
  controllers: [CasherController],
  providers: [
    ServiceType,
    Invoice,
    InvoiceItem,
    Casher,
    ServiceTypeService,
    CasherService,
    InvoiceService,
  ],
  exports: [ServiceTypeService, CasherService, InvoiceService],
})
export class CasherModule {}
