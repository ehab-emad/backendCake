export class TicketMessage {
  constructor(
    public id: string,
    public ticketId: string,
    public clientId: string | null,
    public userId: string | null,
    public message: string,
    public createdAt: Date
  ) {}
}
