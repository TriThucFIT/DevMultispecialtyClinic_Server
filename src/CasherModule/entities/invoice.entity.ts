import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Patient } from 'src/PatientModule/entities/patient.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Casher } from './casher.entity';
import { InvoiceItem } from './invoiceItem.entity';

@Entity('invoice')
export class Invoice extends BaseClassProperties {
  @Column()
  date: Date;
  @Column()
  total: number;
  @Column({
    length: 20,
  })
  status: string;
  @JoinColumn({
    name: 'patient_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Patient, (patient) => patient.id)
  patient: Patient;
  @JoinColumn({
    name: 'casher_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Casher, (casher) => casher.id)
  casher: Casher;
  @JoinColumn({
    name: 'invoice_item_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  invoideItems: InvoiceItem[];
}
