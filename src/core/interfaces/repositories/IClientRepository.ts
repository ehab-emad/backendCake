import { Client } from "../../entities/Client";

export interface IClientRepository {
  findById(id: string): Promise<Client | null>;
  findAll(): Promise<Client[]>;
  create(client: Client): Promise<void>;
  update(client: Client): Promise<void>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<Client | null>;
  findByPhone(phone: string): Promise<Client | null>;
}
