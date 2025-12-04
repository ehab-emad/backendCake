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
exports.AddFavoritesToCustomer1758900000000000 = void 0;
class AddFavoritesToCustomer1758900000000000 {
    constructor() {
        this.name = 'AddFavoritesToCustomer1758900000000000';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the column already exists
            const hasColumn = yield queryRunner.hasColumn('customers', 'favorites');
            if (!hasColumn) {
                yield queryRunner.query(`
                ALTER TABLE \`customers\`
                ADD COLUMN \`favorites\` JSON NULL
                DEFAULT (CAST('[]' AS JSON))
                COMMENT 'List of favorite items with type and ID (e.g., [{"type": "flight", "id": "123"}, {"type": "hotel", "id": "456"}])';
            `);
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE \`customers\` DROP COLUMN \`favorites\`;
        `);
        });
    }
}
exports.AddFavoritesToCustomer1758900000000000 = AddFavoritesToCustomer1758900000000000;
