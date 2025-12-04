import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateClients20240101000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "clients",
        engine: "InnoDB",
        columns: [
          {
            name: "id",
            type: "char",
            length: "36",
            isPrimary: true,
            charset: "utf8mb4",
            collation: "utf8mb4_unicode_ci",
          },
          { name: "name", type: "varchar", length: "100" },
          { name: "email", type: "varchar", length: "255", isUnique: true },
          { name: "address", type: "varchar", length: "255", isNullable: true },
          { name: "phone", type: "varchar", length: "20", isNullable: true },

          {
            name: "profile_image",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "license_number",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "city",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "website_url",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "additional_phone_number",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "subscription_type",
            type: "varchar",
            length: "50",
            isNullable: true,
            charset: "utf8mb4",
            collation: "utf8mb4_unicode_ci",
          },
          { name: "rating", type: "decimal", precision: 4, scale: 2, default: 0, isNullable: true },
          { name: "approved", type: "boolean", default: false },
          { name: "active", type: "boolean", default: true },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("clients", true);
  }
}
