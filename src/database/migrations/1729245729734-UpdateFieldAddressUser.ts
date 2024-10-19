import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFieldAddressUser1729245729734 implements MigrationInterface {
  name = 'UpdateFieldAddressUser1729245729734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cho phép cột `address` nhận giá trị NULL
    await queryRunner.query(
      `ALTER TABLE \`doctor\` MODIFY \`address\` VARCHAR(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`patient\` MODIFY \`address\` VARCHAR(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Receptionist\` MODIFY \`address\` VARCHAR(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pharmacist\` MODIFY \`address\` VARCHAR(100) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`casher\` MODIFY \`address\` VARCHAR(100) NULL`,
    );

    // Xóa dữ liệu cũ trong cột `address`
    await queryRunner.query(`UPDATE \`doctor\` SET \`address\` = NULL`);
    await queryRunner.query(`UPDATE \`patient\` SET \`address\` = NULL`);
    await queryRunner.query(`UPDATE \`Receptionist\` SET \`address\` = NULL`);
    await queryRunner.query(`UPDATE \`pharmacist\` SET \`address\` = NULL`);
    await queryRunner.query(`UPDATE \`casher\` SET \`address\` = NULL`);

    // Thay đổi kiểu dữ liệu của cột `address` sang JSON
    await queryRunner.query(
      `ALTER TABLE \`doctor\` MODIFY COLUMN \`address\` json`,
    );
    await queryRunner.query(
      `ALTER TABLE \`patient\` MODIFY COLUMN \`address\` json`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Receptionist\` MODIFY COLUMN \`address\` json`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pharmacist\` MODIFY COLUMN \`address\` json`,
    );
    await queryRunner.query(
      `ALTER TABLE \`casher\` MODIFY COLUMN \`address\` json`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
