import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { MaskEntity } from "./Mask.model";

@Entity("mask_images")
export class MaskImageEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ name: "mask_id", type: "char", length: "36" })
  maskId!: string;

  @ManyToOne(() => MaskEntity, (mask) => mask.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "mask_id" })
  mask!: MaskEntity;

  @Column({ name: "image_url", type: "varchar", length: "255" })
  imageUrl!: string;
}
