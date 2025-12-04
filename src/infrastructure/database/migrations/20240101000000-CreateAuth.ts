import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateAuth20240101000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "auth_users",
        columns: [
          {
            name: "id",
            type: "char",
            length: "36",
            charset: "utf8mb4",
            collation: "utf8mb4_unicode_ci",
            isPrimary: true,
          },
          {
            name: "first_name",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "last_name",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: true,
          },
          {
            name: "phone_number",
            type: "varchar",
            length: "20",
            isUnique: true,
            isNullable: true,
          },
          {
            name: "password_hash",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "provider",
            type: "enum",
            enum: ["local", "google", "apple", "phone"],
            default: "'local'",
          },
          {
            name: "provider_id",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "phone_verified",
            type: "boolean",
            default: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      "auth_users",
      new TableIndex({
        name: "IDX_AUTH_USER_EMAIL",
        columnNames: ["email"],
      })
    );
    await queryRunner.createIndex(
      "auth_users",
      new TableIndex({
        name: "IDX_AUTH_USER_PHONE",
        columnNames: ["phone_number"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("auth_users", "IDX_AUTH_USER_PHONE");
    await queryRunner.dropIndex("auth_users", "IDX_AUTH_USER_EMAIL");
    await queryRunner.dropTable("auth_users");
  }
}
