import { injectable } from "inversify";
import { Repository, MoreThan } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { OtpEntity } from "../models/Otp.model";
import { IOtpRepository } from "../../../core/interfaces/repositories/IOtpRepository";
import { Otp } from "../../../core/entities/Otp";

@injectable()
export class OtpRepository implements IOtpRepository {
  private get repo(): Repository<OtpEntity> {
    if (!AppDataSource.isInitialized) {
      throw new Error("Data source is not initialized");
    }
    return AppDataSource.getRepository(OtpEntity);
  }

  async create(o: Otp): Promise<void> {
    const ent = this.repo.create({
      id: o.id,
      user_id: o.userId,
      hash: o.hash,
      expires_at: o.expiresAt,
      createdAt: o.createdAt,
    });
    await this.repo.save(ent);
  }

  async findValid(userId: string): Promise<Otp[]> {
    const now = new Date();
    const ents = await this.repo.find({
      where: { user_id: userId, expires_at: MoreThan(now) },
    });
    return ents.map(
      (e) => new Otp(e.id, e.user_id, e.hash, e.expires_at, e.createdAt)
    );
  }

  async countRequestsSince(userId: string, since: Date): Promise<number> {
    return this.repo.count({
      where: { user_id: userId, createdAt: MoreThan(since) },
    });
  }

  async listRequestsSince(userId: string, since: Date): Promise<Otp[]> {
    const ents = await this.repo.find({
      where: { user_id: userId, createdAt: MoreThan(since) },
      order: { createdAt: "ASC" },
    });
    return ents.map(
      (e) => new Otp(e.id, e.user_id, e.hash, e.expires_at, e.createdAt)
    );
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
