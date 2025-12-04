import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { MaskEntity } from "./Mask.model";

@Entity("final_products")
export class FinalProductEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ name: "mask_id", type: "char", length: "36" })
  maskId!: string;

  @ManyToOne(() => MaskEntity, (mask) => mask.finalProducts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "mask_id" })
  mask!: MaskEntity;

  @Column({ type: "varchar", length: "255" })
  name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "varchar", length: "255" })
  category!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
