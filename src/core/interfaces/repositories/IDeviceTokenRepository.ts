export interface IDeviceTokenRepository {
  addOrUpdate(authUserId: string, token: string): Promise<void>;

  listForUser(authUserId: string): Promise<string[]>;

  remove(authUserId: string, token: string): Promise<void>;
}
