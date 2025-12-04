"use strict";
// import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
// export class AddCustomerDetailsToReservations1718361700000 implements MigrationInterface {
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.addColumns('reservations', [
//             new TableColumn({
//                 name: 'name',
//                 type: 'varchar',
//                 length: '255',
//                 isNullable: true,
//             }),
//             new TableColumn({
//                 name: 'email',
//                 type: 'varchar',
//                 length: '255',
//                 isNullable: true,
//             }),
//             new TableColumn({
//                 name: 'gender',
//                 type: 'varchar',
//                 length: '20',
//                 isNullable: true,
//             }),
//             new TableColumn({
//                 name: 'latitude',
//                 type: 'decimal',
//                 precision: 10,
//                 scale: 7,
//                 isNullable: true,
//             }),
//             new TableColumn({
//                 name: 'longitude',
//                 type: 'decimal',
//                 precision: 10,
//                 scale: 7,
//                 isNullable: true,
//             }),
//             new TableColumn({
//                 name: 'nationality',
//                 type: 'varchar',
//                 length: '100',
//                 isNullable: true,
//             }),
//             new TableColumn({
//                 name: 'passport_number',
//                 type: 'varchar',
//                 length: '50',
//                 isNullable: true,
//             }),
//             new TableColumn({
//                 name: 'passport_expiry',
//                 type: 'date',
//                 isNullable: true,
//             }),
//             new TableColumn({
//                 name: 'phone_number',
//                 type: 'varchar',
//                 length: '20',
//                 isNullable: true,
//             }),
//             new TableColumn({
//                 name: 'date_of_birth',
//                 type: 'date',
//                 isNullable: true,
//             })
//         ]);
//     }
//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.dropColumns('reservations', [
//             'name',
//             'email',
//             'gender',
//             'latitude',
//             'longitude',
//             'nationality',
//             'passport_number',
//             'passport_expiry',
//             'phone_number',
//             'date_of_birth'
//         ]);
//     }
// }
