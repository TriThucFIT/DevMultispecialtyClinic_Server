import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddMedicalRecordEntryToInvoice1729415175587
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add column medical_record_entry into Invoice table
    await queryRunner.addColumn(
      'invoice',
      new TableColumn({
        name: 'medical_record_entry_id',
        type: 'int',
        isNullable: true,
        isUnique: true,
      }),
    );

    // Foreign key for medical_record_entry -> invoice
    await queryRunner.createForeignKey(
      'invoice',
      new TableForeignKey({
        name: 'FK_Invoice_MedicalRecordEntry',
        columnNames: ['medical_record_entry_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'medical_record_entry',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop column medical_record_entry from Invoice table
    await queryRunner.dropColumn('invoice', 'medical_record_entry_id');

    // Drop foreign key FK_Invoice_MedicalRecordEntry
    await queryRunner.dropForeignKey(
      'invoice',
      'FK_Invoice_MedicalRecordEntry',
    );
  }
}
