import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";
import { ITicketMessageRepository } from "../../core/interfaces/repositories/ITicketMessageRepository";
import { TicketMessage } from "../../core/entities/TicketMessage";
import { TYPES } from "../../shared/di/types";

@injectable()
export class TicketMessageService {
  constructor(
    @inject(TYPES.TicketMessageRepository)
    private readonly repo: ITicketMessageRepository
  ) {}

  async addMessage(
    ticketId: string,
    clientId: string | null,
    userId: string | null,
    message: string
  ): Promise<TicketMessage> {
    const id = uuid();
    const now = new Date();
    const msg = new TicketMessage(id, ticketId, clientId, userId, message, now);
    await this.repo.create(msg);
    return msg;
  }

  async listMessages(ticketId: string): Promise<TicketMessage[]> {
    return this.repo.findByTicket(ticketId);
  }
}
