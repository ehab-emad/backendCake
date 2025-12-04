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
exports.FixDuplicateMigrations9999999999999 = void 0;
class FixDuplicateMigrations9999999999999 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mark the failed migration as completed
            yield queryRunner.query(`
            INSERT IGNORE INTO migrations_history(timestamp, name) 
            VALUES (1700000000000, 'AddCustomerContactInfo1700000000000')
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // This is a one-way migration, no need to implement down
        });
    }
}
exports.FixDuplicateMigrations9999999999999 = FixDuplicateMigrations9999999999999;
