import { Otp } from "../../entities/Otp";

export interface IOtpRepository {
  create(o: Otp): Promise<void>;

  findValid(userId: string): Promise<Otp[]>;

  delete(id: string): Promise<void>;

  countRequestsSince(userId: string, since: Date): Promise<number>;

  listRequestsSince(userId: string, since: Date): Promise<Otp[]>;
}
