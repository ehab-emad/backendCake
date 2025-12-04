export class Otp {
  constructor(
    public id: string,
    public userId: string,
    public hash: string,
    public readonly createdAt: Date,
    public expiresAt: Date
  ) {}
}
