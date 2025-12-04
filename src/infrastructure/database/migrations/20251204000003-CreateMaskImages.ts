
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMaskImages20251204000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "mask_images",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
          },
          {
            name: "mask_id",
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
      "mask_images",
      new TableForeignKey({
        columnNames: ["mask_id"],
        referencedTableName: "masks",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        name: "FK_mask_images_mask_id",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("mask_images", "FK_mask_images_mask_id");
    await queryRunner.dropTable("mask_images");
  }
}
