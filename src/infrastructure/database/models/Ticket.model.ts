import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { TicketAttachmentEntity } from "./TicketAttachment.model";
import { TicketMessageEntity } from "./TicketMessage.model";

@Entity("tickets")
export class TicketEntity {
  @PrimaryColumn("char", { length: 36 }) id!: string;

  @Column("varchar", { length: 64 }) ticket_number!: string;
  @Column("varchar", { length: 255 }) title!: string;
  @Column({
    type: "enum",
    enum: ["open", "pending", "closed"],
    default: "open",
  })
  status!: "open" | "pending" | "closed";

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updated_at!: Date;

  @OneToMany(() => TicketAttachmentEntity, (attachment) => attachment.ticket, {
    cascade: true,
  })
  attachments!: TicketAttachmentEntity[];

  // ← NEW: one→many relationship for messages
  @OneToMany(() => TicketMessageEntity, (msg) => msg.ticket, {
    cascade: true,
  })
  messages!: TicketMessageEntity[];
}
