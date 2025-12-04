import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestampsToRooms1756650535102 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add created_at if missing
        const hasCreatedAt = await queryRunner.hasColumn("rooms", "created_at");
        if (!hasCreatedAt) {
            await queryRunner.query(
                `ALTER TABLE rooms ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
            );
        }

        // Add updated_at if missing
        const hasUpdatedAt = await queryRunner.hasColumn("rooms", "updated_at");
        if (!hasUpdatedAt) {
            await queryRunner.query(
                `ALTER TABLE rooms ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop updated_at if exists
        const hasUpdatedAt = await queryRunner.hasColumn("rooms", "updated_at");
        if (hasUpdatedAt) {
            await queryRunner.query(`ALTER TABLE rooms DROP COLUMN updated_at`);
        }

        // Drop created_at if exists
        const hasCreatedAt = await queryRunner.hasColumn("rooms", "created_at");
        if (hasCreatedAt) {
            await queryRunner.query(`ALTER TABLE rooms DROP COLUMN created_at`);
        }
    }
}
