
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFlavorImages20251204000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "flavor_images",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
          },
          {
            name: "flavor_id",
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
      "flavor_images",
      new TableForeignKey({
        columnNames: ["flavor_id"],
        referencedTableName: "flavors",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        name: "FK_flavor_images_flavor_id",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("flavor_images", "FK_flavor_images_flavor_id");
    await queryRunner.dropTable("flavor_images");
  }
}
