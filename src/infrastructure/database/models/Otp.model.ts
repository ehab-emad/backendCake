import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("otps")
export class OtpEntity {
  @PrimaryColumn("char", { length: 36 })
  id!: string;

  @Column("char", { name: "user_id", length: 36 })
  user_id!: string;

  @Column()
  hash!: string;

  @Column({ name: "expires_at", type: "datetime" })
  expires_at!: Date;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    update: false,
  })
  createdAt!: Date;
}
