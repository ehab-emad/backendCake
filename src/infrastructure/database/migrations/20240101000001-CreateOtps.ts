import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateOtps20240101000001 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "otps",
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
          {
            name: "user_id",
            type: "char",
            length: "36",
            isNullable: false,
            charset: "utf8mb4",
            collation: "utf8mb4_unicode_ci",
          },
          { name: "hash", type: "varchar", length: "255" },
          { name: "expires_at", type: "datetime" },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    await q.createForeignKey(
      "otps",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedTableName: "auth_users",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("otps");
    const fk = table!.foreignKeys.find((fk) =>
      fk.columnNames.includes("user_id")
    );
    if (fk) await q.dropForeignKey("otps", fk);
    await q.dropTable("otps");
  }
}
