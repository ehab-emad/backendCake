import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { MaskImageEntity } from "./MaskImage.model";
import { ShapeEntity } from "./Shape.model";
import { FlavorEntity } from "./Flavor.model";
import { FinalProductEntity } from "./FinalProduct.model";

@Entity("masks")
export class MaskEntity {
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

  @ManyToOne(() => ShapeEntity, (shape) => shape.masks, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "shape_id" })
  shape!: ShapeEntity;

  @Column({ name: "flavor_id", type: "char", length: "36" })
  flavorId!: string;

  @ManyToOne(() => FlavorEntity, (flavor) => flavor.masks, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "flavor_id" })
  flavor!: FlavorEntity;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => MaskImageEntity, (image) => image.mask)
  images!: MaskImageEntity[];

  @OneToMany(() => FinalProductEntity, (finalProduct) => finalProduct.mask)
  finalProducts!: FinalProductEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
