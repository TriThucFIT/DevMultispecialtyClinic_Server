import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UpdatePrescriptionColumns1729415175998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // rename table medication to medications
    // await queryRunner.renameTable('prescription', 'prescriptions');

    await queryRunner.addColumn(
      'prescriptions',
      new TableColumn({
        name: 'date',
        type: 'datetime',
        default: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('prescriptions', 'date');
    await queryRunner.renameTable('prescriptions', 'prescription');
  }
}
