import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from './entities/ServiceType.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoiceItem.entity';
import { Casher } from './entities/casher.entity';
import { PharmacistModule } from 'src/PharmacistModule/pharmacist.module';
import { ServiceTypeService } from './services/ServiceType.service';

@Module({
  imports: [
    PharmacistModule,
    TypeOrmModule.forFeature([ServiceType, Invoice, InvoiceItem, Casher]),
  ],
  controllers: [],
  providers: [
    ServiceType,
    Invoice,
    InvoiceItem,
    Casher,
    ServiceTypeService,
  ],
  exports: [
    ServiceTypeService,
  ],
})
export class CasherModule {}
