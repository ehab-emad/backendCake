"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, "../../../.env") });
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "travel_booking",
    synchronize: false,
    logging: true,
    entities: [
        path_1.default.resolve(__dirname, "../../infrastructure/database/models/*.{js,ts}"),
    ],
    migrations: [
        path_1.default.resolve(__dirname, "../../infrastructure/database/migrations/*.{js,ts}"),
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
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Loaded entities:", exports.AppDataSource.entityMetadatas.map((e) => e.name));
})
    .catch((err) => {
    console.error("DataSource initialization failed:", err);
});
exports.default = exports.AppDataSource;
