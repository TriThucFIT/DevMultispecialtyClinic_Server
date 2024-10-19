import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsWalkInToAppointment1729243279981
  implements MigrationInterface
{
  name = 'AddIsWalkInToAppointment1729243279981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`appointment\` ADD \`isWalkIn\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`appointment\` DROP COLUMN \`isWalkIn\``,
    );
  }
}
