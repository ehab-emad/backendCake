import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { ClientEntity } from "../models/Client.model";
import { IClientRepository } from "../../../core/interfaces/repositories/IClientRepository";
import { Client } from "../../../core/entities/Client";

@injectable()
export class ClientRepository implements IClientRepository {
  private repo: Repository<ClientEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(ClientEntity);
  }

  async findById(id: string): Promise<Client | null> {
    const ent = await this.repo.findOne({
      where: { id },
      relations: ["attachments"],
    });
    return ent ? this.toDomain(ent) : null;
  }

  async findAll(): Promise<Client[]> {
    const ents = await this.repo.find({ relations: ["attachments"] });
    return ents.map((e) => this.toDomain(e));
  }

  async create(client: Client): Promise<void> {
    await this.repo.save(this.toEntity(client));
  }

  async update(client: Client): Promise<void> {
    await this.repo.save(this.toEntity(client));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const ent = await this.repo.findOne({
      where: { email },
      relations: ["attachments"],
    });
    return ent ? this.toDomain(ent) : null;
  }

  async findByPhone(phone: string): Promise<Client | null> {
    const ent = await this.repo.findOne({
      where: { phone },
      relations: ["attachments"],
    });
    return ent ? this.toDomain(ent) : null;
  }

  private toDomain(ent: ClientEntity): Client {
    const attachments = ent.attachments?.map((a) => a.path) ?? [];
    return new Client(
      ent.id,
      ent.name,
      ent.email,
      typeof ent.rating === 'string' ? parseFloat(ent.rating) : (ent.rating || 0),
      ent.address ?? undefined,
      ent.phone ?? undefined,
      ent.profileImage ?? undefined,
      attachments,
      ent.licenseNumber ?? undefined,
      ent.city,
      ent.websiteUrl,
      ent.additionalPhoneNumber,
      ent.subscriptionType ?? undefined,
      ent.approved,
      ent.active,
      ent.createdAt,
      ent.updatedAt
    );
  }

  private toEntity(client: Client): ClientEntity {
    const ent = new ClientEntity();
    ent.id = client.id;
    ent.name = client.name;
    ent.email = client.email;
    ent.address = client.address ?? null;
    ent.phone = client.phone ?? null;
    ent.profileImage = client.profileImage ?? null;
    ent.licenseNumber = client.licenseNumber ?? null;
    ent.city = client.city ?? null;
    ent.websiteUrl = client.websiteUrl ?? null;
    ent.additionalPhoneNumber = client.additionalPhoneNumber ?? null;
    ent.subscriptionType = client.subscriptionType ?? null;
    ent.rating = typeof client.rating === 'string' ? parseFloat(client.rating) : (client.rating || 0);
    ent.approved = client.approved;
    ent.active = client.active;
    
    // Preserve the original created_at timestamp if it exists
    if (client.createdAt) {
      ent.createdAt = client.createdAt;
    }
    
    // Always update the updated_at timestamp to current time
    ent.updatedAt = new Date();
    
    return ent;
  }
}
