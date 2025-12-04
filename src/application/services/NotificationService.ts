import { injectable, inject } from "inversify";
import { firebaseMessaging } from "../../infrastructure/firebase/admin";
import { IDeviceTokenRepository } from "../../core/interfaces/repositories/IDeviceTokenRepository";
import { TYPES } from "../../shared/di/types";

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.DeviceTokenRepository)
    private readonly tokens: IDeviceTokenRepository
  ) {}

  public async sendReservationNotification(
    authUserId: string,
    title: string,
    body: string,
    data: Record<string, string> = {}
  ): Promise<void> {
    const tokens = await this.tokens.listForUser(authUserId);
    if (tokens.length === 0) return;

    await firebaseMessaging.sendEachForMulticast({
      notification: { title, body },
      data,
      tokens,
    });
  }
}
