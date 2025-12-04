import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { TicketEntity } from "../models/Ticket.model";
import { TicketAttachmentEntity } from "../models/TicketAttachment.model";
import { ITicketRepository } from "../../../core/interfaces/repositories/ITicketRepository";
import { Ticket } from "../../../core/entities/Ticket";

@injectable()
export class TicketRepository implements ITicketRepository {
  private get repo(): Repository<TicketEntity> {
    if (!AppDataSource.isInitialized) throw new Error("DS not initialized");
    return AppDataSource.getRepository(TicketEntity);
  }

  private get attRepo(): Repository<TicketAttachmentEntity> {
    return AppDataSource.getRepository(TicketAttachmentEntity);
  }

  async findById(id: string): Promise<Ticket | null> {
    const e = await this.repo.findOne({
      where: { id },
      relations: ["attachments"],
    });
    if (!e) return null;

    const t = new Ticket(
      e.id,
      e.ticket_number,
      e.title,
      e.status,
      e.created_at
    );
    t.updatedAt = e.updated_at;

    t.attachments = e.attachments.map((a) => ({
      id: a.id,
      path: a.path,
      createdAt: a.created_at,
    }));
    return t;
  }

  async findAll(clientId?: string): Promise<Ticket[]> {
    const qb = this.repo
      .createQueryBuilder("ticket")
      .leftJoinAndSelect("ticket.attachments", "attachment");

    if (clientId) {
      qb.innerJoin(
        "ticket.messages",
        "message",
        "message.client_id = :clientId",
        { clientId }
      );
    }

    // execute
    const es = await qb.getMany();

    return es.map((e) => {
      const t = new Ticket(
        e.id,
        e.ticket_number,
        e.title,
        e.status,
        e.created_at
      );
      t.updatedAt = e.updated_at;

      t.attachments = e.attachments.map((a) => ({
        id: a.id,
        path: a.path,
        createdAt: a.created_at,
      }));
      return t;
    });
  }

  async create(t: Ticket): Promise<void> {
    await this.repo.save({
      id: t.id,
      ticket_number: t.ticketNumber,
      title: t.title,
      status: t.status,
      created_at: t.createdAt,
      updatedAt: t.updatedAt,
    });
  }

  async update(t: Ticket): Promise<void> {
    await this.repo.save({
      id: t.id,
      ticket_number: t.ticketNumber,
      title: t.title,
      status: t.status,
      created_at: t.createdAt,
      updatedAt: t.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async addAttachment(
    ticketId: string,
    path: string,
    id: string
  ): Promise<void> {
    await this.attRepo.save({ id, ticket_id: ticketId, path });
  }
}
