import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "device_tokens" })
export class DeviceTokenEntity {
  @PrimaryColumn("varchar")
  id!: string;

  @Column({ name: "auth_user_id", type: "varchar" })
  authUserId!: string;

  @Column({ type: "varchar" })
  token!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
