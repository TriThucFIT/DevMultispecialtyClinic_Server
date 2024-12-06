import { PrescriptionStatus } from 'src/PharmacistModule/enums';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFieldsToPrescriptions1681234567890
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm cột `note`
    await queryRunner.addColumn(
      'prescriptions', // Tên bảng
      new TableColumn({
        name: 'note', // Tên cột
        type: 'text', // Kiểu dữ liệu
        isNullable: false, // Không cho phép null
      }),
    );

    // Thêm cột `status`
    await queryRunner.addColumn(
      'prescriptions', // Tên bảng
      new TableColumn({
        name: 'status', // Tên cột
        type: 'enum', // Kiểu enum
        enum: Object.values(PrescriptionStatus), // Các giá trị enum tương ứng với `PrescriptionStatus`
        default: `'${PrescriptionStatus.PENDING}'`, // Giá trị mặc định
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa cột `note`
    await queryRunner.dropColumn('prescriptions', 'note');

    // Xóa cột `status`
    await queryRunner.dropColumn('prescriptions', 'status');
  }
}
