export class Client {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public rating: number = 0,
    public address?: string,
    public phone?: string,
    public profileImage?: string,
    public attachments: string[] = [],
    public licenseNumber?: string,
    public city?: string | null,
    public websiteUrl?: string | null,
    public additionalPhoneNumber?: string | null,
    public subscriptionType?: string,
    public approved: boolean = false,
    public active: boolean = true,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
