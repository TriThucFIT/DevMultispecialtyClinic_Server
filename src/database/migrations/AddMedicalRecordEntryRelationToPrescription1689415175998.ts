import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddMedicalRecordEntryRelationToPrescription1689415175998
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add column "medical_record_entry_id" to "prescriptions"
    await queryRunner.addColumn(
      'prescriptions',
      new TableColumn({
        name: 'medical_record_entry_id',
        type: 'int',
        isNullable: true, // Allow null initially to avoid breaking existing records
      }),
    );

    // Create foreign key between "prescriptions" and "medical_record_entries"
    await queryRunner.createForeignKey(
      'prescriptions',
      new TableForeignKey({
        columnNames: ['medical_record_entry_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'medical_record_entry',
        onDelete: 'SET NULL', // Set to NULL if the referenced record is deleted
        onUpdate: 'CASCADE', // Update the foreign key if the primary key changes
      }),
    );
    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key
    const table = await queryRunner.getTable('prescriptions');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('medical_record_entry_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('prescriptions', foreignKey);
    }

    // Drop the column "medical_record_entry_id"
    await queryRunner.dropColumn('prescriptions', 'medical_record_entry_id');
  }
}
