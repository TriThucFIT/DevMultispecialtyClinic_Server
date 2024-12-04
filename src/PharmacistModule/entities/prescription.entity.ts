import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Pharmacist } from './pharmacist.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { InvoiceItem } from 'src/CasherModule/entities/invoiceItem.entity';
import { PrescriptionMedication } from './prescriptionMedication.entity';
import { PrescriptionStatus } from '../enums';
import { MedicalRecordEntry } from 'src/PatientModule/entities/MedicalRecordEntry.entity';

@Entity('prescriptions')
export class Prescription extends BaseClassProperties {
  @Column({
    type: 'date',
    nullable: false,
  })
  date: Date;

  @Column({
    type: 'text',
    nullable: false,
  })
  note: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.PENDING,
  })
  status: PrescriptionStatus;
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
  @OneToMany(
    () => PrescriptionMedication,
    (prescriptionMedication) => prescriptionMedication.prescription,
  )
  medications: PrescriptionMedication[];

  @JoinColumn({
    name: 'medical_record_entry_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(
    () => MedicalRecordEntry,
    (medicalRecordEntry) => medicalRecordEntry.id,
  )
  medicalRecordEntry: MedicalRecordEntry;
}
