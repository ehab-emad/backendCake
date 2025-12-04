import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { AuthEntity } from "./Auth.model";

@Entity({ name: "customers" })
export class CustomerEntity {
  @PrimaryColumn({ type: "char", length: 36 })
  id!: string;

  @Column({ name: "auth_user_id", type: "char", length: 36 })
  authUserId!: string;

  @ManyToOne(() => AuthEntity, (a) => a.customers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "auth_user_id" })
  authUser!: AuthEntity;

  @Column({
    name: "customer_type",
    type: "enum",
    enum: ["VIP", "Regular"],
    default: "Regular",
  })
  customerType!: "VIP" | "Regular";

  @Column({ type: "varchar", length: 50, nullable: true })
  nationality?: string;

  @Column({
    name: "passport_number",
    type: "varchar",
    length: 50,
    nullable: true,
  })
  passportNumber?: string;

  @Column({
    name: "national_id",
    type: "varchar",
    length: 50,
    nullable: true,
  })
  nationalId?: string;

  @Column({
    name: "national_id_expiry",
    type: "date",
    nullable: true,
  })
  nationalIdExpiry?: string;

  @Column({
    name: "address_line1",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  addressLine1?: string;

  @Column({
    name: "address_line2",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  addressLine2?: string;

  @Column({ name: "city", type: "varchar", length: 100, nullable: true })
  city?: string;

  @Column({ name: "country", type: "varchar", length: 100, nullable: true })
  country?: string;

  @Column({ name: "registration_date", type: "date", nullable: true })
  registrationDate?: string;

  @Column({ name: "expiration_date", type: "date", nullable: true })
  expirationDate?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column({ name: "customername", type: "varchar", length: 100, nullable: true })
  customername?: string;

  @Column({ name: "email", type: "varchar", length: 150, nullable: true })
  email?: string;

  @Column({ name: "phone_number", type: "varchar", length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ name: "profile_picture", type: "varchar", length: 500, nullable: true })
  profilePicture?: string;

  @Column({ name: "locale", type: "varchar", length: 10, nullable: true })
  locale?: string;

  @Column({ name: "gender", type: "varchar", length: 20, nullable: true })
  gender?: string;

  @Column({ name: "first_name", type: "varchar", length: 100, nullable: true })
  firstName?: string;

  @Column({ name: "last_name", type: "varchar", length: 100, nullable: true })
  lastName?: string;

  @Column({ 
    name: "latitude", 
    type: "decimal", 
    precision: 10, 
    scale: 7, 
    nullable: true 
  })
  latitude?: number;

  @Column({ 
    name: "longitude", 
    type: "decimal", 
    precision: 10, 
    scale: 7, 
    nullable: true 
  })
  longitude?: number;

  @Column({ name: "date_of_birth", type: "date", nullable: true })
  dateOfBirth?: string;

  @Column({ name: "passport_expiry", type: "date", nullable: true })
  passportExpiry?: string;
  @Column({
    name: "favorites",
    type: "json",
    nullable: false,
    default: () => "CAST('[]' AS JSON)",
    comment:
      'List of favorite items with type and ID (e.g., [{"type": "flight", "id": "123"}, {"type": "hotel", "id": "456"}])',
  })
  favorites!: Array<{
    type: 'flight' | 'hotel' | 'package' | 'trip';
    id: string;
  }>;
  
}
