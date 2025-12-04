import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { TicketMessageEntity } from "../models/TicketMessage.model";
import { ITicketMessageRepository } from "../../../core/interfaces/repositories/ITicketMessageRepository";
import { TicketMessage } from "../../../core/entities/TicketMessage";

@injectable()
export class TicketMessageRepository implements ITicketMessageRepository {
  private get repo(): Repository<TicketMessageEntity> {
    if (!AppDataSource.isInitialized) throw new Error("DS not inited");
    return AppDataSource.getRepository(TicketMessageEntity);
  }

  async create(m: TicketMessage): Promise<void> {
    await this.repo.save({
      id: m.id,
      ticket_id: m.ticketId,
      client_id: m.clientId,
      user_id: m.userId,
      message: m.message,
      created_at: m.createdAt,
    });
  }

  async findByTicket(ticketId: string): Promise<TicketMessage[]> {
    const ents = await this.repo.find({
      where: { ticket_id: ticketId },
      order: { created_at: "ASC" },
    });
    return ents.map(
      (e) =>
        new TicketMessage(
          e.id,
          e.ticket_id,
          e.client_id,
          e.user_id,
          e.message,
          e.created_at
        )
    );
  }
}
