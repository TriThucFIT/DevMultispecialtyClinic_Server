import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Patient } from 'src/PatientModule/entities/patient.entity';
import { Casher } from './casher.entity';
import { InvoiceItem } from './invoiceItem.entity';
import { InvoiceStatus } from '../enums/InvoiceStatus.enum';
import { PaymentMethod } from '../enums/itemType.enum';
import { log } from 'console';

@Entity('invoice')
export class Invoice extends BaseClassProperties {
  @Column({
    type: 'date',
  })
  date: Date;

  @Column()
  total_amount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total_paid: number;

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

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  invoiceItems: InvoiceItem[];

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  payment_method: PaymentMethod;

  @Column({
    type: 'date',
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

  @BeforeInsert()
  setDefaultPaymentPersonInfo() {
    if (this.patient) {
      this.payment_person_phone =
        this.payment_person_phone || this.patient.phone || 'default_phone';
      this.payment_person_name =
        this.payment_person_name || this.patient.fullName || 'default_name';
    }
  }

  @BeforeInsert()
  setDefaultDate() {
    this.payment_date = this.payment_date || new Date();
    this.date = this.date || new Date();
  }

  @BeforeInsert()
  calculateTotalAmount() {
    this.total_amount = this.invoiceItems.reduce(
      (total, item) => total + Number(item.amount),
      0,
    );

    log('total_amount into hook', this.total_amount);
  }

  @BeforeUpdate()
  @BeforeInsert()
  calculateTotalPaid() {
    log(
      'total_paid into hook',
      this.invoiceItems.map((item) => {
        log(
          'calculateTotalPaid',
          item.status === InvoiceStatus.PAID ? Number(item.amount) : 0,
        );
        return item.name;
      }),
    );
    this.total_paid = this.invoiceItems.reduce(
      (total, item) =>
        total + item.status === InvoiceStatus.PAID ? Number(item.amount) : 0,
      0,
    );

    log('total_paid into hook', this.total_paid);
  }

  // @BeforeUpdate()
  @BeforeInsert()
  calculateStatus() {
    this.status =
      Number(this.total_paid) === Number(this.total_amount)
        ? InvoiceStatus.PAID
        : InvoiceStatus.PENDING;

    log('status into hook', this.status);
  }

  // @BeforeUpdate()
  @BeforeInsert()
  checkStatus() {
    const everyItemIsPaid = this.invoiceItems.every(
      (item) => item.status === InvoiceStatus.PAID,
    );
    if (everyItemIsPaid) {
      this.status = InvoiceStatus.PAID;
    } else {
      this.status = InvoiceStatus.PENDING;
    }

    log('status into hook', this.status);
  }
}
