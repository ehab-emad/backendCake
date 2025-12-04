import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ProductImageEntity } from "./ProductImage.model";
import { ProductRatingEntity } from "./ProductRating.model";
import { ClientEntity } from "./Client.model";

@Entity("products")
export class ProductEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ type: "varchar", length: "255" })
  name!: string;

  @ManyToOne(() => ClientEntity, (client) => client.products)
  @JoinColumn({ name: "client_id" })
  clientId!: string;

  @ManyToOne(() => ClientEntity, (client) => client.products, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "client_id" })
  client!: ClientEntity;

  @Column({ type: "text" })
  description!: string;

  @Column({ name: "full_description", type: "text" })
  fullDescription!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ name: "stock_quantity", type: "int", default: 0 })
  stockQuantity!: number;

  @Column({ name: "image_url", type: "varchar", length: "255", nullable: true })
  imageUrl?: string;

  @Column({ type: "varchar", length: "255", nullable: true })
  material?: string;

  @Column({ type: "varchar", length: "255", nullable: true })
  beads?: string;

  @Column({ type: "varchar", length: "255", nullable: true })
  length?: string;

  @Column({ type: "varchar", length: "255", nullable: true })
  weight?: string;

  @Column({ type: "decimal", precision: 4, scale: 2, default: 0 })
  rating!: number;

  @Column({ type: "int", default: 0 })
  sales!: number;

  @Column({ type: "varchar", length: "50", default: "نشط" })
  status!: string;

  @OneToMany(() => ProductImageEntity, (image) => image.product)
  images!: ProductImageEntity[];

  @OneToMany(() => ProductRatingEntity, (rating) => rating.product)
  ratings!: ProductRatingEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
