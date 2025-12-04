export type ProviderType = "local" | "google" | "apple" | "phone";

export class AuthUser {
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public id: string,
    public first_name: string,
    public last_name: string,
    public email: string | null,
    public provider: ProviderType,
    public password_hash?: string,
    public provider_id?: string,
    public phoneVerified: boolean = false,
    public firstName?: string,
    public lastName?: string,
    public phoneNumber?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }
}
