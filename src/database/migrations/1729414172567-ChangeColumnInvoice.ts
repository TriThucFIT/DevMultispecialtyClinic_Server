import { InvoiceStatus } from 'src/CasherModule/enums/InvoiceStatus.enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateInvoiceEntityMigration implements MigrationInterface {
  name = 'AddInvoiceItemColume1729414162799';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'invoice_item',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: Object.values(InvoiceStatus),
        isNullable: false,
        default: `'${InvoiceStatus.PENDING}'`,
      }),
    );

    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoice_item', 'status');
    
  }
}
