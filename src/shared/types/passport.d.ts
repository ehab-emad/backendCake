export {};

declare global {
  namespace Express {
    interface User {
      id: string;

      firstName?: string;
      lastName?: string;

      email?: string;
      phoneNumber?: string;

      passwordHash?: string;

      provider: "local" | "google" | "apple" | "phone";
      providerId?: string;

      phoneVerified: boolean;

      createdAt: Date;
      updatedAt: Date;
    }
  }
}

declare module "passport" {
  interface User {
    id: string;

    firstName?: string;
    lastName?: string;

    email?: string;
    phoneNumber?: string;

    passwordHash?: string;

    provider: "local" | "google" | "apple" | "phone";
    providerId?: string;

    phoneVerified: boolean;

    createdAt: Date;
    updatedAt: Date;
  }
}
