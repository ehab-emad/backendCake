import { DataSource } from "typeorm";
import path from "path";
import { config } from "dotenv";

// Load environment variables
config({ path: path.resolve(__dirname, ".env") });

// Create and export the DataSource
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",  // This should be 'db' in Docker
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Ff5192aa",
    database: process.env.DB_NAME || "ticket",
    synchronize: false,
    logging: true,
    entities: [
        path.resolve(__dirname, "src/infrastructure/database/models/*.ts")
    ],
    migrations: [
        path.resolve(__dirname, "src/infrastructure/database/migrations/*.ts")
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
    timezone: "Z"
});

// For debugging
console.log("Database Configuration:", {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    database: process.env.DB_NAME || "ticket"
});
