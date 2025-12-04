import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestampsToTrips1756656805719 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasCreatedAt = await queryRunner.hasColumn("trips", "created_at");
        if (!hasCreatedAt) {
            await queryRunner.query(
                `ALTER TABLE trips ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
            );
        }

        const hasUpdatedAt = await queryRunner.hasColumn("trips", "updated_at");
        if (!hasUpdatedAt) {
            await queryRunner.query(
                `ALTER TABLE trips ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasUpdatedAt = await queryRunner.hasColumn("trips", "updated_at");
        if (hasUpdatedAt) {
            await queryRunner.query(`ALTER TABLE trips DROP COLUMN updated_at`);
        }

        const hasCreatedAt = await queryRunner.hasColumn("trips", "created_at");
        if (hasCreatedAt) {
            await queryRunner.query(`ALTER TABLE trips DROP COLUMN created_at`);
        }
    }
}
