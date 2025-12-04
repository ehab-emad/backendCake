
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateShapeImages20251204000001a implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "shape_images",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
          },
          {
            name: "shape_id",
            type: "varchar",
            length: "36",
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
      "shape_images",
      new TableForeignKey({
        columnNames: ["shape_id"],
        referencedTableName: "shapes",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        name: "FK_shape_images_shape_id", // Explicitly naming the foreign key
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("shape_images", "FK_shape_images_shape_id");
    await queryRunner.dropTable("shape_images");
  }
}
