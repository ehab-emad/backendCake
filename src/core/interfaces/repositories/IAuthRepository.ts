import { AuthUser, ProviderType } from "../../entities/Auth";

export interface IAuthRepository {
  findByEmail(email: string): Promise<AuthUser | null>;

  findById(id: string): Promise<AuthUser | null>;

  create(user: AuthUser): Promise<void>;

  update(user: AuthUser): Promise<void>;

  delete(id: string): Promise<void>;

  findByProviderId(
    provider: ProviderType,
    providerId: string
  ): Promise<AuthUser | null>;

  findByPhoneNumber(phone: string): Promise<AuthUser | null>;
}
