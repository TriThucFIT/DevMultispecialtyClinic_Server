import { ItemType } from 'src/casher/enums/itemType.enum';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('invoice_item') // Make sure this is an entity with @Entity decorator
export class InvoiceItem extends BaseClassProperties {
  @Column({
    type: 'enum',
    enum: ItemType,
    default: ItemType.OTHER,
  })
  itemType: ItemType;

  @Column()
  amount: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoideItems)
  @JoinColumn({
    name: 'invoice_id',
    referencedColumnName: 'id',
  })
  invoice: Invoice;
}
