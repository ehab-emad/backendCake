import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ClientAttachmentEntity } from "./ClientAttachment.model";
import { ProductEntity } from "./Product.model";

@Entity("clients")
export class ClientEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ type: "varchar", length: "100" })
  name!: string;

  @Column({ type: "varchar", length: "255", unique: true })
  email!: string;

  @Column({ type: "decimal", precision: 4, scale: 2, default: 0 })
  rating!: number;

  @Column({ type: "varchar", length: "255", nullable: true })
  address!: string | null;

  @Column({ type: "varchar", length: "20", nullable: true })
  phone!: string | null;

  @Column({
    type: "varchar",
    length: "255",
    nullable: true,
    name: "profile_image",
  })
  profileImage!: string | null;

  @Column({
    type: "varchar",
    length: "50",
    nullable: true,
    name: "license_number",
  })
  licenseNumber!: string | null;

  @Column({ type: "varchar", nullable: true })
  city!: string | null;

  @Column({ name: "website_url", type: "varchar", nullable: true })
  websiteUrl!: string | null;

  @Column({
    name: "additional_phone_number",
    type: "varchar",
    nullable: true,
  })
  additionalPhoneNumber!: string | null;

  @Column({
    type: "varchar",
    length: "50",
    name: "subscription_type",
  })
  subscriptionType!: string | null;

  @Column({ type: "boolean", default: false })
  approved!: boolean;

  @Column({ type: "boolean", default: true })
  active!: boolean;

  @OneToMany(() => ClientAttachmentEntity, (attachment) => attachment.client, {
    cascade: true,
  })
  attachments!: ClientAttachmentEntity[];

  @OneToMany(() => ProductEntity, (product) => product.client, {
    cascade: true,
  })
  products!: ProductEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;
}
