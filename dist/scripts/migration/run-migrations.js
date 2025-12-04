"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    password: process.env.DB_PASSWORD || "Ff5192aa",
    database: process.env.DB_NAME || "ticket",
    // synchronize: false,
    logging: false,
    entities: [path_1.default.join(__dirname, "../../src/core/entities/*.model.{js,ts}")],
    migrations: [
        path_1.default.join(__dirname, "../../src/infrastructure/database/migrations/*.{js,ts}"),
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
function runMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.AppDataSource.initialize();
            console.log("Data Source has been initialized!");
            yield exports.AppDataSource.runMigrations();
            console.log("Migrations have been run successfully!");
        }
        catch (error) {
            console.error("Error during migration:", error);
        }
        finally {
            yield exports.AppDataSource.destroy();
        }
    });
}
runMigrations();
