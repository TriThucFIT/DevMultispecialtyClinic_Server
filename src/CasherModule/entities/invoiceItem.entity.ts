import { ItemType } from 'src/CasherModule/enums/itemType.enum';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('invoice_item')
export class InvoiceItem extends BaseClassProperties {
  @Column({
    type: 'enum',
    enum: ItemType,
    default: ItemType.SERVICE,
  })
  itemType: ItemType;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoideItems)
  @JoinColumn({
    name: 'invoice_id',
    referencedColumnName: 'id',
  })
  invoice: Invoice;
}
