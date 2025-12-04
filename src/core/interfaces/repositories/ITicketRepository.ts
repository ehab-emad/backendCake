import { Ticket } from "../../entities/Ticket";

export interface ITicketRepository {
  findById(id: string): Promise<Ticket | null>;
  findAll(clientId?: string): Promise<Ticket[]>;
  create(t: Ticket): Promise<void>;
  update(t: Ticket): Promise<void>;
  delete(id: string): Promise<void>;

  addAttachment(ticketId: string, path: string, id: string): Promise<void>;
}
