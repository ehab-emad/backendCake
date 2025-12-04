import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TicketEntity } from "./Ticket.model";
import { ClientEntity } from "./Client.model";
import { AuthEntity } from "./Auth.model";

@Entity("ticket_messages")
export class TicketMessageEntity {
  @PrimaryColumn("char", { length: 36 }) id!: string;

  @Column("char", { length: 36 }) ticket_id!: string;
  @Column("char", { length: 36, nullable: true }) client_id!: string | null;
  @Column("char", { length: 36, nullable: true }) user_id!: string | null;

  @Column("text") message!: string;

  @CreateDateColumn({ type: "timestamp" }) created_at!: Date;

  // ← Add this ManyToOne so TypeORM can link ticket_messages.ticket_id → tickets.id
  @ManyToOne(() => TicketEntity, (ticket) => ticket.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ticket_id" })
  ticket!: TicketEntity;

  @ManyToOne(() => ClientEntity, (c) => c.id, { nullable: true })
  @JoinColumn({ name: "client_id" })
  client!: ClientEntity | null;

  @ManyToOne(() => AuthEntity, (a) => a.id, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: AuthEntity | null;
}
