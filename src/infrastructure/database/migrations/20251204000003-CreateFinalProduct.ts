import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFinalProduct20251204000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "final_products",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "stock_quantity",
            type: "int",
            default: 0,
            isNullable: false,
          },
          {
            name: "image_url",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "shape_id",
            type: "varchar",
            length: "36",
            isNullable: true,
          },
          {
            name: "flavor_id",
            type: "varchar",
            length: "36",
            isNullable: true,
          },
          {
            name: "mask_id",
            type: "varchar",
            length: "36",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "final_products",
      new TableForeignKey({
        columnNames: ["shape_id"],
        referencedTableName: "shapes",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "final_products",
      new TableForeignKey({
        columnNames: ["flavor_id"],
        referencedTableName: "flavors",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "final_products",
      new TableForeignKey({
        columnNames: ["mask_id"],
        referencedTableName: "masks",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("final_products");
  }
}
