import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { ClientAttachmentEntity } from "../models/ClientAttachment.model";
import type {
  IClientAttachmentRepository,
  ClientAttachment,
} from "../../../core/interfaces/repositories/IClientAttachmentRepository";
import { v4 as uuid } from "uuid";

@injectable()
export class ClientAttachmentRepository implements IClientAttachmentRepository {
  private repo: Repository<ClientAttachmentEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(ClientAttachmentEntity);
  }

  async listForClient(clientId: string): Promise<ClientAttachment[]> {
    const ents = await this.repo.find({
      where: { clientId },
      order: { createdAt: "ASC" },
    });
    return ents.map((e) => ({
      id: e.id,
      path: e.path,
    }));
  }

  async add(clientId: string, filePath: string): Promise<ClientAttachment> {
    const ent = this.repo.create({
      id: uuid(),
      clientId,
      path: filePath,
    } as Partial<ClientAttachmentEntity>);

    const saved = await this.repo.save(ent);
    return {
      id: saved.id,
      path: saved.path,
    };
  }

  async removeById(attachmentId: string): Promise<void> {
    await this.repo.delete({ id: attachmentId });
  }
}
