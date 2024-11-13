import { Patient } from 'src/PatientModule/entities/patient.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPatientId1729414162506 implements MigrationInterface {
  name = 'AddPatientId1729414162506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`patient\` ADD \`patientId\` varchar(255) NULL`,
    );
    const patients :Patient[] = await queryRunner.query(
      `SELECT \`id\` FROM \`patient\` WHERE \`patientId\` IS NULL OR \`patientId\` = ''`,
    );

    for (const patient of patients) {
      await queryRunner.query(
        `UPDATE \`patient\` SET \`patientId\` = ? WHERE \`id\` = ?`,
        ['PDMC' + Math.floor(Math.random() * 10000) + patient.id, patient.id],
      );
      
    }

    await queryRunner.query(
      `ALTER TABLE \`patient\` MODIFY \`patientId\` varchar(255) NOT NULL UNIQUE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`patient\` DROP COLUMN \`patientId\``,
    );
  }
}
