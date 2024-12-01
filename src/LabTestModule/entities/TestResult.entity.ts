import { Entity, Column, OneToOne } from 'typeorm';
import { LabRequest } from './LabRequest.entity';
import { BaseClassProperties } from 'src/Common/BaseClassProperties';

@Entity('test_result')
export class TestResult extends BaseClassProperties {
  @Column({ type: 'text', nullable: true })
  result: string;

  @Column({ type: 'json', nullable: true })
  detail: Record<string, any>[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @OneToOne(() => LabRequest, (request) => request.testResult, {
    onDelete: 'CASCADE',
  })
  labRequest: LabRequest;
}
