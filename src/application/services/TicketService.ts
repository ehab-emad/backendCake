import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";
import { ITicketRepository } from "../../core/interfaces/repositories/ITicketRepository";
import { Ticket } from "../../core/entities/Ticket";
import { CreateTicketDTO } from "../dto/CreateTicket.dto";
import { UpdateTicketDTO } from "../dto/UpdateTicket.dto";
import { TYPES } from "../../shared/di/types";

@injectable()
export class TicketService {
  constructor(
    @inject(TYPES.TicketRepository)
    private readonly repo: ITicketRepository
  ) {}

  public async createTicket(dto: CreateTicketDTO): Promise<Ticket> {
    const id = uuid();
    const now = new Date();
    const ticketNumber = `TICK-${Date.now()}`;

    const ticket = new Ticket(id, ticketNumber, dto.title, dto.status, now);
    ticket.updatedAt = now;

    await this.repo.create(ticket);

    if (dto.attachments) {
      for (const path of dto.attachments) {
        await this.repo.addAttachment(id, path, uuid());
      }
    }

    const created = await this.repo.findById(id);
    if (!created) throw new Error("Failed to load created ticket");
    return created;
  }

  public async listTickets(clientId?: string): Promise<Ticket[]> {
    return this.repo.findAll(clientId);
  }

  public async getTicket(id: string): Promise<Ticket> {
    const t = await this.repo.findById(id);
    if (!t) throw new Error("Ticket not found");
    return t;
  }

  public async updateTicket(id: string, dto: UpdateTicketDTO): Promise<Ticket> {
    const t = await this.repo.findById(id);
    if (!t) throw new Error("Ticket not found");

    if (dto.title !== undefined) t.title = dto.title;
    if (dto.status !== undefined) t.status = dto.status;

    t.updatedAt = new Date();
    await this.repo.update(t);

    if (dto.newAttachments) {
      for (const path of dto.newAttachments) {
        await this.repo.addAttachment(id, path, uuid());
      }
    }

    const updated = await this.repo.findById(id);
    if (!updated) throw new Error("Failed to load updated ticket");
    return updated;
  }

  public async deleteTicket(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
