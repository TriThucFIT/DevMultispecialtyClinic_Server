import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Column, Entity } from 'typeorm';

@Entity('medication')
export class Medication extends BaseClassProperties {
  @Column({
    length: 100,
  })
  name: string;
  @Column({
    length: 50,
  })
  dosage: string;
  @Column({
    nullable: false,
    default: 0,
  })
  unitPrice: number;
}
