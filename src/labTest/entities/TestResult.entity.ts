import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { LabRequest } from './LabRequest.entity';
import { LabTest } from './LabTest.entity';

export class TestResult extends BaseClassProperties {
  @Column({
    length: 500,
  })
  result: string;
  @Column({
    length: 500,
  })
  notes: string;
  @JoinColumn({
    name: 'lab_request_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => LabTest, (labTest) => labTest.id)
  labTest: LabTest;
}
