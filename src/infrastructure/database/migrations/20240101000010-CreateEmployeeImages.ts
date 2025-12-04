import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateEmployeeImages20240101000010 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "employee_images",
        columns: [
          { name: "id", type: "char", length: "36", isPrimary: true },
          {
            name: "employee_id",
            type: "char",
            length: "36",
            isNullable: false,
          },
          { name: "path", type: "varchar", length: "255" },
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
      "employee_images",
      new TableForeignKey({
        columnNames: ["employee_id"],
        referencedTableName: "employees",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("employee_images");
    const fk = table!.foreignKeys.find((fk) =>
      fk.columnNames.includes("employee_id")
    );
    if (fk) await q.dropForeignKey("employee_images", fk);
    await q.dropTable("employee_images");
  }
}
