import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { FlavorImageEntity } from "./FlavorImage.model";
import { ShapeEntity } from "./Shape.model";
import { MaskEntity } from "./Mask.model";

@Entity("flavors")
export class FlavorEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ type: "varchar", length: "255" })
  name!: string;

  @Column({ name: "shape_id", type: "char", length: "36" })
  shapeId!: string;

  @ManyToOne(() => ShapeEntity, (shape) => shape.flavors, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "shape_id" })
  shape!: ShapeEntity;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => FlavorImageEntity, (image) => image.flavor)
  images!: FlavorImageEntity[];

  @OneToMany(() => MaskEntity, (mask) => mask.flavor)
  masks!: MaskEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
