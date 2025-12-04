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
exports.AddFlightColumns1754828817815 = void 0;
class AddFlightColumns1754828817815 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE flights 
            ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'AED',
            ADD COLUMN departure_iata VARCHAR(10) NOT NULL,
            ADD COLUMN arrival_iata VARCHAR(10) NOT NULL,
            ADD COLUMN is_suggested BOOLEAN NOT NULL DEFAULT false
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE flights
            DROP COLUMN currency,
            DROP COLUMN departure_iata,
            DROP COLUMN arrival_iata,
            DROP COLUMN is_suggested
        `);
        });
    }
}
exports.AddFlightColumns1754828817815 = AddFlightColumns1754828817815;
