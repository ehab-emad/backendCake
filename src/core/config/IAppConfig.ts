export interface IAppConfig {
  APP_URL: string;
  BACKEND_URL: string;
  FRONTEND_URL: string;
  PORT: number;
  NODE_ENV: "development" | "production" | "test" | string;

  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_LOGGING: boolean;

  SESSION_SECRET: string;

  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;

  APPLE_CLIENT_ID: string;

  STRIPE_SECRET_KEY: string;
  MAMO_API_KEY: string;

  TAMARA_BASE_URL: string;
  TAMARA_API_TOKEN: string;

  MAMO_BASE_URL: string;

  VONAGE_API_KEY: string;
  VONAGE_API_SECRET: string;
  VONAGE_BRAND_NAME: string;
}
