import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMedicalRecordAndLabSystem1698230000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create medical_record table
    await queryRunner.createTable(
      new Table({
        name: 'medical_record',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'patient_id',
            type: 'int',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Foreign key for medical_record -> patient
    await queryRunner.createForeignKey(
      'medical_record',
      new TableForeignKey({
        name: 'FK_MedicalRecord_Patient',
        columnNames: ['patient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'patient',
        onDelete: 'CASCADE',
      }),
    );

    // Create medical_record_entry table
    await queryRunner.createTable(
      new Table({
        name: 'medical_record_entry',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'medical_record_id',
            type: 'int',
          },
          {
            name: 'doctor_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'visit_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'symptoms',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'diagnosis',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'treatment_plan',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Foreign key for medical_record_entry -> doctor
    await queryRunner.createForeignKey(
      'medical_record_entry',
      new TableForeignKey({
        name: 'FK_MedicalRecordEntry_Doctor',
        columnNames: ['doctor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'doctor',
        onDelete: 'SET NULL',
      }),
    );

    // Foreign key for medical_record_entry -> medical_record
    await queryRunner.createForeignKey(
      'medical_record_entry',
      new TableForeignKey({
        name: 'FK_MedicalRecordEntry_MedicalRecord',
        columnNames: ['medical_record_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'medical_record',
        onDelete: 'CASCADE',
      }),
    );

    // Create lab_test table
    await queryRunner.createTable(
      new Table({
        name: 'lab_test',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'price',
            type: 'float',
            default: 0,
          },
          {
            name: 'doctor_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Create lab_request table
    await queryRunner.createTable(
      new Table({
        name: 'lab_request',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'medical_record_entry_id',
            type: 'int',
          },
          {
            name: 'lab_test_id',
            type: 'int',
          },
          {
            name: 'request_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'pending'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Foreign key for lab_request -> medical_record_entry
    await queryRunner.createForeignKey(
      'lab_request',
      new TableForeignKey({
        name: 'FK_LabRequest_MedicalRecordEntry',
        columnNames: ['medical_record_entry_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'medical_record_entry',
        onDelete: 'CASCADE',
      }),
    );

    // Foreign key for lab_request -> lab_test
    await queryRunner.createForeignKey(
      'lab_request',
      new TableForeignKey({
        name: 'FK_LabRequest_LabTest',
        columnNames: ['lab_test_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lab_test',
        onDelete: 'CASCADE',
      }),
    );

    // Create test_result table
    await queryRunner.createTable(
      new Table({
        name: 'test_result',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'lab_request_id',
            type: 'int',
          },
          {
            name: 'result',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Foreign key for test_result -> lab_request
    await queryRunner.createForeignKey(
      'test_result',
      new TableForeignKey({
        name: 'FK_TestResult_LabRequest',
        columnNames: ['lab_request_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lab_request',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('test_result');
    await queryRunner.dropTable('lab_request');
    await queryRunner.dropTable('lab_test');
    await queryRunner.dropTable('medical_record_entry');
    await queryRunner.dropTable('medical_record');
  }
}
