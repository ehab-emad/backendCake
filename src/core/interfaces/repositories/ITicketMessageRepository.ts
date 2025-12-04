import { TicketMessage } from "../../entities/TicketMessage";

export interface ITicketMessageRepository {
  create(msg: TicketMessage): Promise<void>;
  findByTicket(ticketId: string): Promise<TicketMessage[]>;
}
