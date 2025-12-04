import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { FlavorEntity } from "./Flavor.model";

@Entity("flavor_images")
export class FlavorImageEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ name: "flavor_id", type: "char", length: "36" })
  flavorId!: string;

  @ManyToOne(() => FlavorEntity, (flavor) => flavor.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "flavor_id" })
  flavor!: FlavorEntity;

  @Column({ name: "image_url", type: "varchar", length: "255" })
  imageUrl!: string;
}
