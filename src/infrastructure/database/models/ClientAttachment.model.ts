import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ClientEntity } from "./Client.model";

@Entity("client_attachments")
export class ClientAttachmentEntity {
  @PrimaryColumn({ type: "char", length: 36 })
  id!: string;

  @Column({ name: "client_id", type: "char", length: 36 })
  clientId!: string;

  @Column({ name: "path", type: "varchar", length: 512 })
  path!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @ManyToOne(() => ClientEntity, (client) => client.attachments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "client_id" })
  client!: ClientEntity;
}
