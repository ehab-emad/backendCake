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
exports.AddTransitAndRestToFlight1712345678901 = void 0;
class AddTransitAndRestToFlight1712345678901 {
    constructor() {
        this.name = 'AddTransitAndRestToFlight1712345678901';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`flight\` ADD \`transit\` tinyint NOT NULL DEFAULT 0`);
            yield queryRunner.query(`ALTER TABLE \`flight\` ADD \`rest\` varchar(255) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`flight\` DROP COLUMN \`rest\``);
            yield queryRunner.query(`ALTER TABLE \`flight\` DROP COLUMN \`transit\``);
        });
    }
}
exports.AddTransitAndRestToFlight1712345678901 = AddTransitAndRestToFlight1712345678901;
