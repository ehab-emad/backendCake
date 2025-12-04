import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CustomerEntity } from "./Customer.model";
import { EmployeeEntity } from "./Employee.model";

export type ProviderType = "local" | "google" | "apple" | "phone";

@Entity("auth_users")
export class AuthEntity {
  @PrimaryColumn({ type: "char", length: 36 })
  id!: string;

  @Column({ name: "first_name", type: "varchar", length: 100, nullable: true })
  firstName?: string;

  @Column({ name: "last_name", type: "varchar", length: 100, nullable: true })
  lastName?: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  email?: string | null;

  @Column({
    name: "phone_number",
    type: "varchar",
    length: 20,
    unique: true,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    name: "password_hash",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  passwordHash?: string;

  @Column({
    type: "enum",
    enum: ["local", "google", "apple", "phone"],
    default: "local",
  })
  provider!: ProviderType;

  @Column({
    name: "provider_id",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  providerId!: string | null;

  @Column({ name: "phone_verified", type: "boolean", default: false })
  phoneVerified!: boolean;

  @OneToMany(() => CustomerEntity, (c) => c.authUser)
  customers!: CustomerEntity[];

  @OneToMany(() => EmployeeEntity, (e) => e.authUser)
  employees!: EmployeeEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
