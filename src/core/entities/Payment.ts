export class Payment {
  constructor(
    public id: string,
    public processNumber: string,
    public reservationId: string | null,
    public customerId: string | null,
    public clientId: string | null,
    public category: string,
    public transactionStatus: "paid" | "under_review" | "cancelled" | "failed" | "refunded" | "pending",
    public amount: number,
    public createdAt?: Date
  ) {}
}
