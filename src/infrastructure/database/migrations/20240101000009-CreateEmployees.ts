import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateEmployees20240101000009 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "employees",
        engine: "InnoDB",
        columns: [
          { name: "id", type: "char", length: "36", isPrimary: true },
          {
            name: "client_id",
            type: "char",
            length: "36",
            isNullable: false,
            charset: "utf8mb4",
            collation: "utf8mb4_unicode_ci",
          },
          {
            name: "auth_user_id",
            type: "char",
            length: "36",
            isNullable: false,
            charset: "utf8mb4",
            collation: "utf8mb4_unicode_ci",
          },
          {
            name: "address",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "profile_image",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          { name: "role", type: "varchar", length: "100" },
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

    await q.createForeignKey(
      "employees",
      new TableForeignKey({
        columnNames: ["client_id"],
        referencedTableName: "clients",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await q.createForeignKey(
      "employees",
      new TableForeignKey({
        columnNames: ["auth_user_id"],
        referencedTableName: "auth_users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("employees");
    for (const fk of table!.foreignKeys.filter((fk) =>
      ["client_id", "auth_user_id"].includes(fk.columnNames[0])
    )) {
      await q.dropForeignKey("employees", fk);
    }
    await q.dropTable("employees");
  }
}
