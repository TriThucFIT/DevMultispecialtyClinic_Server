import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Patient } from 'src/PatientModule/entities/patient.entity';
import { Casher } from './casher.entity';
import { InvoiceItem } from './invoiceItem.entity';
import { InvoiceStatus } from '../enums/InvoiceStatus.enum';
import { PaymentMethod } from '../enums/itemType.enum';

@Entity('invoice')
export class Invoice extends BaseClassProperties {
  @Column()
  date: Date;

  @Column()
  total: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

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

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  payment_method: PaymentMethod;

  @Column({
    type: 'date',
    default: new Date(),
  })
  payment_date: Date;

  @Column({
    nullable: false,
  })
  payment_person_phone: string;

  @Column({
    nullable: false,
  })
  payment_person_name: string;

  constructor(patient?: Patient) {
    super();

    if (patient) {
      this.patient = patient;
      this.payment_person_phone = patient.phone || 'default_phone';
      this.payment_person_name = patient.fullName || 'default_name';
    }
  }

  @BeforeInsert()
  setDefaultPaymentPersonInfo() {
    if (this.patient) {
      this.payment_person_phone =
        this.payment_person_phone || this.patient.phone || 'default_phone';
      this.payment_person_name =
        this.payment_person_name || this.patient.fullName || 'default_name';
    }
  }
}
