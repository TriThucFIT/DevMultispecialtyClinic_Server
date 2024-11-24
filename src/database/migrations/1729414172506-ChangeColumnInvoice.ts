import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class UpdateInvoiceEntityMigration implements MigrationInterface {
  name = 'UpdateInvoiceEntityMigration1729414164556';
  public async up(queryRunner: QueryRunner): Promise<void> {

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
