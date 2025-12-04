import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity("payments")
export class PaymentEntity {
  @PrimaryColumn("char", { length: 36 }) id!: string;

  @Column({ type: "varchar", length: 50 }) process_number!: string;

  @Column("char", { length: 36, nullable: true }) reservation_id!:
    | string
    | null;
  @Column("char", { length: 36, nullable: true }) customer_id!: string | null;
  @Column("char", { length: 36, nullable: true }) client_id!: string | null;

  @Column({ type: "varchar", length: 100 }) category!: string;

  @Column({
    type: "enum",
    enum: ["paid", "under_review", "cancelled", "failed", "refunded", "pending"] as const,
    default: "under_review",
  })
  transaction_status!: "paid" | "under_review" | "cancelled" | "failed" | "refunded" | "pending";

  @Column("decimal", { precision: 10, scale: 2 }) amount!: string;

  @CreateDateColumn() created_at!: Date;
}
