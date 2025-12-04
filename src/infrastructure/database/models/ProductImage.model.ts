import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { ProductEntity } from "./Product.model";

@Entity("product_images")
export class ProductImageEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ name: "product_id", type: "char", length: "36" })
  productId!: string;

  @ManyToOne(() => ProductEntity, (product) => product.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ type: "varchar", length: "255" })
  path!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
