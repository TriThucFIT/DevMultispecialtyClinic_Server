import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Pharmacist } from './pharmacist.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { InvoiceItem } from 'src/casher/entities/invoiceItem.entity';

@Entity('prescription')
export class Prescription extends BaseClassProperties {
  date: Date;
  @JoinColumn({
    name: 'pharmacist_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Pharmacist, (pharmacist) => pharmacist.id)
  pharmacist: Pharmacist;
  @JoinColumn({
    name: 'invoice_item_id',
    referencedColumnName: 'id',
  })
  @OneToOne(() => InvoiceItem, (invoiceItem) => invoiceItem.id)
  invoice: InvoiceItem;
}
