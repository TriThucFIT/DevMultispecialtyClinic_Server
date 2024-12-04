import { BaseClassProperties } from 'src/Common/BaseClassProperties';
import { Column, Entity } from 'typeorm';

@Entity('medications')
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

  @Column({
    nullable: false,
    default: 100,
  })
  inStock: number;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    nullable: false,
  })
  unitStock: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: false,
  })
  usage: string;
}
