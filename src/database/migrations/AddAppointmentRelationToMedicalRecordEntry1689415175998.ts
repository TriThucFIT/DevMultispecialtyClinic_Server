import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddAppointmentRelationToMedicalRecordEntry1689415175998
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add column "appointment_id" to "medical_record_entry"
    await queryRunner.addColumn(
      'medical_record_entry',
      new TableColumn({
        name: 'appointment_id',
        type: 'int',
        isNullable: true, // Allow null initially
      }),
    );

    // Create foreign key between "medical_record_entry" and "appointment"
    await queryRunner.createForeignKey(
      'medical_record_entry',
      new TableForeignKey({
        columnNames: ['appointment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'appointment',
        onDelete: 'SET NULL', // Set to NULL if the appointment is deleted
        onUpdate: 'CASCADE', // Update the foreign key if the primary key changes
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key
    const table = await queryRunner.getTable('medical_record_entry');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('appointment_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('medical_record_entry', foreignKey);
    }

    // Drop the column "appointment_id"
    await queryRunner.dropColumn('medical_record_entry', 'appointment_id');
  }
}
