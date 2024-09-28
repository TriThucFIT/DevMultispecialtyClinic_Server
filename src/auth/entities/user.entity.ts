import { BaseClassProperties } from 'src/common/BaseClassProperties';
import { Account } from './account.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('user')
export class User extends BaseClassProperties {
  @Column({
    length: 50,
  })
  fullName: string;
  @Column({
    length: 100,
  })
  address: string;
  @Column({
    length: 50,
    unique: true,
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
