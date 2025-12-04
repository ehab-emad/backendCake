import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDuplicateMigrations9999999999999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Mark the failed migration as completed
        await queryRunner.query(`
            INSERT IGNORE INTO migrations_history(timestamp, name) 
            VALUES (1700000000000, 'AddCustomerContactInfo1700000000000')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This is a one-way migration, no need to implement down
    }
}
