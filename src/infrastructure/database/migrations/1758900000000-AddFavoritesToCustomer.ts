import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoritesToCustomer1758900000000000 implements MigrationInterface {
    name = 'AddFavoritesToCustomer1758900000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the column already exists
        const hasColumn = await queryRunner.hasColumn('customers', 'favorites');

        if (!hasColumn) {
            await queryRunner.query(`
                ALTER TABLE \`customers\`
                ADD COLUMN \`favorites\` JSON NULL
                DEFAULT (CAST('[]' AS JSON))
                COMMENT 'List of favorite items with type and ID (e.g., [{"type": "flight", "id": "123"}, {"type": "hotel", "id": "456"}])';
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`customers\` DROP COLUMN \`favorites\`;
        `);
    }
}
