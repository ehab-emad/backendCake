import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ProductEntity } from "./Product.model";

@Entity("product_ratings")
export class ProductRatingEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ name: "product_id", type: "char", length: "36" })
  productId!: string;

  @ManyToOne(() => ProductEntity, (product) => product.ratings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;

  @Column({ type: "varchar", length: "100" })
  name!: string;

  @Column({ type: "text", nullable: true, default: "" })
  comment?: string;

  @Column({ type: "decimal", precision: 2, scale: 1 })
  rating!: number;

  @Column({ type: "json", nullable: false, default: () => "CAST('[]' AS JSON)" })
  images!: string[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
