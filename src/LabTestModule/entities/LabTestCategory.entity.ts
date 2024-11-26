import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Column, Entity, OneToMany } from 'typeorm';
import { LabTest } from './LabTest.entity';

@Entity('lab_test_category')
export class LabTestCategory extends BaseClassProperties {
  @Column({
    length: 100,
  })
  name: string;
  @Column({
    length: 1000,
  })
  description: string;

  @OneToMany(() => LabTest, (test) => test.category)
  labtests: LabTest[];
}
