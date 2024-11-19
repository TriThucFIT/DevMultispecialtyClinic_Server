import { InvoiceStatus } from 'src/CasherModule/enums/InvoiceStatus.enum';
import { PaymentMethod } from 'src/CasherModule/enums/itemType.enum';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UpdateInvoiceEntityMigration implements MigrationInterface {
  name = 'UpdateInvoiceEntityMigration1729414164556';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.addColumn(
    //   'invoice',
    //   new TableColumn({
    //     name: 'status',
    //     type: 'enum',
    //     enum: Object.values(InvoiceStatus),
    //     default: `'${InvoiceStatus.PENDING}'`,
    //   }),
    // );

    // await queryRunner.addColumn(
    //   'invoice',
    //   new TableColumn({
    //     name: 'payment_method',
    //     type: 'enum',
    //     enum: Object.values(PaymentMethod),
    //     default: `'${PaymentMethod.CASH}'`,
    //   }),
    // );

    // await queryRunner.addColumn(
    //   'invoice',
    //   new TableColumn({
    //     name: 'payment_date',
    //     type: 'date',
    //     isNullable: true
    //   }),
    // );

    // await queryRunner.addColumn(
    //   'invoice',
    //   new TableColumn({
    //     name: 'payment_person_phone',
    //     type: 'varchar',
    //     isNullable: false,
    //     default: `'default_phone'`,
    //   }),
    // );

    await queryRunner.changeColumn(
      'invoice',
      'date',
      new TableColumn({
        name: 'date',
        type: 'date',
        isNullable: false
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoice', 'status');

    await queryRunner.dropColumn('invoice', 'payment_person_name');

    await queryRunner.dropColumn('invoice', 'payment_person_phone');

    await queryRunner.dropColumn('invoice', 'payment_date');

    await queryRunner.dropColumn('invoice', 'payment_method');
  }
}
