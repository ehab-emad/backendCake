import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ShapeEntity } from "./Shape.model";

@Entity("shape_images")
export class ShapeImageEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ name: "shape_id", type: "char", length: "36" })
  shapeId!: string;

  @ManyToOne(() => ShapeEntity, (shape) => shape.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "shape_id" })
  shape!: ShapeEntity;

  @Column({ name: "image_url", type: "varchar", length: "255" })
  imageUrl!: string;
}
