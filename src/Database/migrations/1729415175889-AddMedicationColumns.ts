// import {
//   MigrationInterface,
//   QueryRunner,
//   TableColumn,
//   TableForeignKey,
// } from 'typeorm';

// export class AddMedicationColumns1729415175889 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // rename table medication to medications
//     await queryRunner.renameTable('medication', 'medications');

//     await queryRunner.addColumn(
//       'medications',
//       new TableColumn({
//         name: 'unitStock',
//         type: 'varchar',
//         isNullable: false,
//       }),
//     );

//     await queryRunner.addColumn(
//       'medications',
//       new TableColumn({
//         name: 'image',
//         type: 'varchar',
//         isNullable: true,
//       }),
//     );
    

//     await queryRunner.addColumn(
//       'medications',
//       new TableColumn({
//         name: 'instock',
//         type: 'int',
//         isNullable: false,
//         default: 100,
//       }),
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropColumn('medications', 'unitStock');
//     await queryRunner.dropColumn('medications', 'image');
//     await queryRunner.dropColumn('medications', 'instock');
//     await queryRunner.renameTable('medications', 'medication');
//   }
// }
