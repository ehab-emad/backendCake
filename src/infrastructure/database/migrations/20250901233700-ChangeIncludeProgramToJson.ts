import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIncludeProgramToJson20250901233700 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("trips");
    if (!hasTable) return;

    // Try to switch columns to JSON (MySQL 5.7+/MariaDB 10.2+). Fallbacks may be needed on older versions.
    await queryRunner.query(`ALTER TABLE trips MODIFY includeProgram JSON NULL`);
    await queryRunner.query(`ALTER TABLE trips MODIFY noIncludeProgram JSON NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable("trips");
    if (!hasTable) return;

    // Revert to previous definition (char(36)) if needed
    await queryRunner.query(`ALTER TABLE trips MODIFY includeProgram CHAR(36) NULL`);
    await queryRunner.query(`ALTER TABLE trips MODIFY noIncludeProgram CHAR(36) NULL`);
  }
}
