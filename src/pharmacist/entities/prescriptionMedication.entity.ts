import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Prescription } from './prescription.entity';
import { Medication } from './Medication.entity';

@Entity('prescriptionMedication')
export class PrescriptionMedication extends BaseClassProperties {
  @PrimaryColumn()
  medication_id: number;

  @PrimaryColumn()
  prescription_id: number;

  @ManyToOne(() => Prescription, (prescription) => prescription.id)
  @JoinColumn({ name: 'prescription_id', referencedColumnName: 'id' })
  prescription: Prescription;

  @ManyToOne(() => Medication, (medication) => medication.id)
  @JoinColumn({ name: 'medication_id', referencedColumnName: 'id' })
  medication: Medication;

  @Column()
  note: string;

  @Column({
    type: 'int',
    nullable: false,
    default: 1,
  })
  quantity: number;
}
