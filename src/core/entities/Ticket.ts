export class Ticket {
  public updatedAt: Date;
  public attachments: { id: string; path: string; createdAt: Date }[];

  constructor(
    public id: string,
    public ticketNumber: string,
    public title: string,
    public status: "open" | "pending" | "closed",
    public createdAt: Date
  ) {
    this.updatedAt = new Date();
    this.attachments = [];
  }
}
