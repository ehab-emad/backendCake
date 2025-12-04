import { DataSource } from "typeorm";
import path from "path";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../../../.env") });

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Ff5192aa",
  database: process.env.DB_NAME || "ticket",
  // synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "../../src/core/entities/*.model.{js,ts}")],
  migrations: [
    path.join(
      __dirname,
      "../../src/infrastructure/database/migrations/*.{js,ts}"
    ),
  ],
  migrationsTableName: "migrations_history",
  extra: {
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
  },
  connectorPackage: "mysql2",
  supportBigNumbers: true,
  bigNumberStrings: false,
  timezone: "Z",
});

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
    await AppDataSource.runMigrations();
    console.log("Migrations have been run successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

runMigrations();
