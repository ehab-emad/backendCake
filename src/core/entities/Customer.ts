import { AggregateRoot } from "./AggregateRoot";
import { CustomerCreatedEvent } from "../events/CustomerCreatedEvent";

export interface FavoriteItem {
  type: 'flight' | 'hotel' | 'package' | 'trip';
  id: string;
}

export class Customer extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly authUserId: string,
    public customerType: "VIP" | "Regular" = "Regular",
    public nationality?: string,
    public latitude?: number,
    public longitude?: number,
    public passportNumber?: string,
    public nationalId?: string,
    public nationalIdExpiry?: string,
    public addressLine1?: string,
    public addressLine2?: string,
    public city?: string,
    public customername?: string,
    public email?: string,
    public phoneNumber?: string,
    public country?: string,
    // Google OAuth fields
    public profilePicture?: string,
    public locale?: string,
    public gender?: string,
    // Name fields for better personalization
    public firstName?: string,
    public lastName?: string,
    // Dates
    public registrationDate?: string,
    public expirationDate?: string,
    public dateOfBirth?: string,
    public passportExpiry?: string,
    // Favorites field
    public favorites: FavoriteItem[] = []
  ) {
    super();
  }

  public upgradeToVIP(): void {
    if (this.customerType !== "VIP") {
      this.customerType = "VIP";
    }
  }

  public create(): void {
    this.apply(new CustomerCreatedEvent(this.id, this.authUserId));
  }
}
