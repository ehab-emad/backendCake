import { injectable, inject } from "inversify";
import { DataSource, Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { IDeviceTokenRepository } from "../../../core/interfaces/repositories/IDeviceTokenRepository";
import { DeviceTokenEntity } from "../models/DeviceToken.model";

@injectable()
export class DeviceTokenRepository implements IDeviceTokenRepository {
  private readonly repo: Repository<DeviceTokenEntity>;

  constructor(@inject("DataSource") ds: DataSource) {
    this.repo = ds.getRepository(DeviceTokenEntity);
  }

  async addOrUpdate(authUserId: string, token: string): Promise<void> {
    const existing = await this.repo.findOne({ where: { authUserId, token } });
    if (!existing) {
      await this.repo.save(this.repo.create({ id: uuid(), authUserId, token }));
    }
  }

  async listForUser(authUserId: string): Promise<string[]> {
    const rows = await this.repo.find({ where: { authUserId } });
    return rows.map((r) => r.token);
  }

  async remove(authUserId: string, token: string): Promise<void> {
    await this.repo.delete({ authUserId, token });
  }
}
