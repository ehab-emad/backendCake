import { DataSource } from "typeorm";
import path from "path";

// Create and export the DataSource for running from host machine
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",  // Connect to localhost from host machine
    port: 3306,         // Default MySQL port
    username: "root",   // Default MySQL username
    password: "Ff5192aa", // Replace with your MySQL root password
    database: "ticket", // Your database name
    // synchronize: false,
    // logging: true,
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
console.log("Host Machine Database Configuration:", {
    host: "localhost",
    port: 3306,
    database: "ticket"
});
