import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TicketEntity } from "./Ticket.model";

@Entity("ticket_attachments")
export class TicketAttachmentEntity {
  @PrimaryColumn("char", { length: 36 }) id!: string;

  @Column("char", { length: 36 }) ticket_id!: string;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.attachments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ticket_id" })
  ticket!: TicketEntity;

  @Column("varchar", { length: 255 }) path!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at!: Date;
}
