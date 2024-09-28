import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Prescription } from './prescription.entity';
import { Medication } from './Medication.entity';

@Entity('prescriptionMedication')
export class PrescriptionMedication extends BaseClassProperties {
  @JoinColumn({
    name: 'prescription_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Prescription, (prescription) => prescription.id)
  prescription: Prescription;
  @JoinColumn({
    name: 'medication_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Medication, (medication) => medication.id)
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
