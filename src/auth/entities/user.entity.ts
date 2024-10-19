import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Account } from './account.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Address } from './Address..type';

export abstract class User extends BaseClassProperties {
  @Column({
    length: 50,
  })
  fullName: string;
  @Column({
    length: 100,
  })
  @Column('json', { nullable: true })
  address: Address;
  @Column({
    length: 50,
  })
  phone: string;
  @Column()
  gender: boolean;
  @Column({
    type: 'date',
  })
  dob: Date;

  @JoinColumn({
    name: 'account_id',
    referencedColumnName: 'id',
  })
  @OneToOne(() => Account, (account) => account.id)
  account: Account;
}
