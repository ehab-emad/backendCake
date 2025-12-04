import { v4 as uuid } from "uuid";
import { inject, injectable } from "inversify";
import type { DataSource } from "typeorm";

import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundException } from "../exceptions/NotFoundException";

import { TYPES } from "../../shared/di/types";
import type { IClientRepository } from "../../core/interfaces/repositories/IClientRepository";
import type {
  IClientAttachmentRepository,
  ClientAttachment,
} from "../../core/interfaces/repositories/IClientAttachmentRepository";
import { Client } from "../../core/entities/Client";

import { ClientEntity } from "../../infrastructure/database/models/Client.model";
import { ClientAttachmentEntity } from "../../infrastructure/database/models/ClientAttachment.model";

@injectable()
export class ClientService {
  constructor(
    @inject(TYPES.ClientRepository)
    private readonly repo: IClientRepository,

    @inject(TYPES.ClientAttachmentRepository)
    private readonly attachRepo: IClientAttachmentRepository,

    @inject("DataSource")
    private readonly dataSource: DataSource
  ) {}

  public async createClient(data: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
    profileImage?: string;
    attachments?: string[];
    licenseNumber?: string;
    city?: string;
    websiteUrl?: string;
    additionalPhoneNumber?: string;
    subscriptionType?: string;
    rating?: number;
    approved?: boolean;
    active?: boolean;
  }): Promise<Client> {
    if (await this.repo.findByEmail(data.email)) {
      throw new ConflictError("Email already in use");
    }

    const clientId = uuid();

    await this.dataSource.transaction(async (manager) => {
      const now = new Date();
      await manager.getRepository(ClientEntity).save({
        id: clientId,
        name: data.name,
        email: data.email,
        address: data.address,
        phone: data.phone,
        profileImage: data.profileImage,
        licenseNumber: data.licenseNumber,
        city: data.city,
        websiteUrl: data.websiteUrl,
        additionalPhoneNumber: data.additionalPhoneNumber,
        subscriptionType: data.subscriptionType,
        rating: data.rating ?? 0,
        approved: data.approved ?? false,
        active: data.active ?? true,
        createdAt: now,
        updatedAt: now
      });

      if (data.attachments?.length) {
        const attRepo = manager.getRepository(ClientAttachmentEntity);
        for (const path of data.attachments) {
          await attRepo.save({ id: uuid(), clientId, path });
        }
      }
    });

    return this.getClient(clientId);
  }

  public async listClients(): Promise<Client[]> {
    return this.repo.findAll();
  }

  public async getClient(id: string): Promise<Client> {
    const client = await this.repo.findById(id);
    if (!client) throw new NotFoundException("Client not found");
    return client;
  }

  public async updateClient(
    id: string,
    data: {
      name?: string;
      email?: string;
      address?: string;
      phone?: string;
      profileImage?: string;
      licenseNumber?: string;
      city?: string;
      websiteUrl?: string;
      additionalPhoneNumber?: string;
      subscriptionType?: string;
      rating?: number;
      approved?: boolean;
      active?: boolean;
    }
  ): Promise<Client> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException("Client not found");

    if (data.email && data.email !== existing.email) {
      if (await this.repo.findByEmail(data.email)) {
        throw new ConflictError("Email already in use");
      }
    }

    await this.dataSource.transaction(async (manager) => {
      const upd: Partial<ClientEntity> = {
        name: data.name,
        email: data.email,
        address: data.address,
        phone: data.phone,
        profileImage: data.profileImage,
        licenseNumber: data.licenseNumber,
        city: data.city,
        websiteUrl: data.websiteUrl,
        additionalPhoneNumber: data.additionalPhoneNumber,
        subscriptionType: data.subscriptionType,
        rating: data.rating,
        approved: data.approved,
        active: data.active,
        // Always update the updated_at timestamp
        updatedAt: new Date()
      };
      
      // Remove undefined values to avoid overwriting with null
      Object.keys(upd).forEach(key => {
        if (upd[key as keyof typeof upd] === undefined) {
          delete upd[key as keyof typeof upd];
        }
      });
      
      await manager.getRepository(ClientEntity).update(id, upd);
    });

    return this.getClient(id);
  }

  public async deleteClient(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  public async listAttachments(clientId: string): Promise<ClientAttachment[]> {
    await this.getClient(clientId);
    return this.attachRepo.listForClient(clientId);
  }

  public async addAttachment(
    clientId: string,
    filePath: string
  ): Promise<ClientAttachment[]> {
    await this.getClient(clientId);

    await this.attachRepo.add(clientId, filePath);
    return this.attachRepo.listForClient(clientId);
  }

  public async removeAttachmentById(
    clientId: string,
    attachmentId: string
  ): Promise<ClientAttachment[]> {
    await this.getClient(clientId);
    await this.attachRepo.removeById(attachmentId);
    return this.attachRepo.listForClient(clientId);
  }
}
