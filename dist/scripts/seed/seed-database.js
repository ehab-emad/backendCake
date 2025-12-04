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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_config_1 = require("../../src/infrastructure/config/database.config");
const AuthSeeder_1 = require("../../src/infrastructure/database/seeders/AuthSeeder");
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const queryRunner = database_config_1.AppDataSource.createQueryRunner();
        try {
            console.log("Connecting to database...");
            yield database_config_1.AppDataSource.initialize();
            yield queryRunner.connect();
            console.log("Seeding auth users...");
            yield queryRunner.startTransaction();
            try {
                yield new AuthSeeder_1.AuthSeeder().run(queryRunner);
                yield queryRunner.commitTransaction();
                console.log("Auth users seeded successfully!");
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw error;
            }
            console.log("Database seeded successfully!");
        }
        catch (error) {
            console.error("Seeding failed:", error);
            process.exit(1);
        }
        finally {
            yield queryRunner.release();
            if (database_config_1.AppDataSource.isInitialized) {
                yield database_config_1.AppDataSource.destroy();
            }
        }
    });
}
seedDatabase();
