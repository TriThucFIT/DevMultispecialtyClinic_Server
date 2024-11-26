import { MedicalRecordEntry } from 'src/PatientModule/entities/MedicalRecordEntry.entity';
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { LabTest } from './LabTest.entity';
import { TestResult } from './TestResult.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { LabTestStatus } from '../enums';

@Entity('lab_request')
export class LabRequest extends BaseClassProperties {
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  requestDate: Date;

  @Column({
    type: 'enum',
    enum: LabTestStatus,
    default: LabTestStatus.PENDING,
  })
  status: LabTestStatus;

  @ManyToOne(() => MedicalRecordEntry, (entry) => entry.labRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'record_entry_id',
    referencedColumnName: 'id',
  })
  medicalRecordEntry: MedicalRecordEntry;

  @ManyToOne(() => LabTest, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'lab_test_id',
    referencedColumnName: 'id',
  })
  labTest: LabTest;

  @OneToOne(() => TestResult, (result) => result.labRequest, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'test_result_id',
    referencedColumnName: 'id',
  })
  testResult: TestResult;
}
