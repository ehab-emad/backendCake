import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProducts20250101000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
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
            name: "full_description",
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
            name: "material",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "beads",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "length",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "weight",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "rating",
            type: "decimal",
            precision: 3,
            scale: 2,
            isNullable: true,
          },
          {
            name: "sales",
            type: "int",
            default: 0,
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            default: "'نشط'",
            isNullable: false,
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

    await queryRunner.createTable(
      new Table({
        name: "product_images",
        columns: [
          {
            name: "image_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "product_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "image_url",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "product_images",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedTableName: "products",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("product_images");
    await queryRunner.dropTable("products");
  }
}
