import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { AuthEntity } from "../models/Auth.model";
import { IAuthRepository } from "../../../core/interfaces/repositories/IAuthRepository";
import { AuthUser, ProviderType } from "../../../core/entities/Auth";

@injectable()
export class AuthRepository implements IAuthRepository {
  private get repo(): Repository<AuthEntity> {
    if (!AppDataSource.isInitialized) {
      throw new Error("Data source is not initialized");
    }
    return AppDataSource.getRepository(AuthEntity);
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const ent = await this.repo.findOneBy({ email });
    return ent ? this.toDomain(ent) : null;
  }

  async findById(id: string): Promise<AuthUser | null> {
    const ent = await this.repo.findOneBy({ id });
    return ent ? this.toDomain(ent) : null;
  }

  async findByProviderId(
    provider: ProviderType,
    providerId: string
  ): Promise<AuthUser | null> {
    const ent = await this.repo.findOneBy({ provider, providerId });
    return ent ? this.toDomain(ent) : null;
  }

  async findByPhoneNumber(phone: string): Promise<AuthUser | null> {
    const ent = await this.repo.findOneBy({ phoneNumber: phone });
    return ent ? this.toDomain(ent) : null;
  }

  async create(user: AuthUser): Promise<void> {
    await this.repo.save(this.toEntity(user));
  }

  async update(user: AuthUser): Promise<void> {
    await this.repo.save(this.toEntity(user));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(ent: AuthEntity): AuthUser {
    return new AuthUser(
      ent.id,
      ent.firstName!,
      ent.lastName!,
      ent.email!,
      ent.provider as ProviderType,
      ent.passwordHash,
      ent.providerId ?? undefined,
      ent.phoneVerified,
      ent.firstName,
      ent.lastName,
      ent.phoneNumber
    );
  }

  private toEntity(user: AuthUser): AuthEntity {
    const ent = new AuthEntity();
    ent.id = user.id;
    ent.firstName = user.firstName;
    ent.lastName = user.lastName;
    ent.email = user.email ?? null;
    ent.phoneNumber = user.phoneNumber;
    ent.passwordHash = user.password_hash ?? "";
    ent.provider = user.provider;
    ent.providerId = user.provider_id ?? null;
    ent.phoneVerified = user.phoneVerified ?? false;
    return ent;
  }
}
