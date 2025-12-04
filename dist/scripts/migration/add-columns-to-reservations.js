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
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.join)(__dirname, '../../.env') });
const AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'ticket',
    entities: [__dirname + '/../../src/core/entities/*.ts'],
    synchronize: false,
    logging: true,
});
function runMigration() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield AppDataSource.initialize();
            console.log('Data Source has been initialized!');
            const queryRunner = AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            // Add new columns
            yield queryRunner.query(`
      ALTER TABLE reservations 
      ADD COLUMN infant INT NOT NULL DEFAULT 0,
      ADD COLUMN rooms INT NOT NULL DEFAULT 1,
      ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;
    `);
            console.log('Migration completed successfully!');
        }
        catch (error) {
            console.error('Error during migration:', error);
            process.exit(1);
        }
        finally {
            yield AppDataSource.destroy();
            process.exit(0);
        }
    });
}
runMigration();
