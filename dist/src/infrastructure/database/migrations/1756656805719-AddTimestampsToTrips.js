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
exports.AddTimestampsToTrips1756656805719 = void 0;
class AddTimestampsToTrips1756656805719 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasCreatedAt = yield queryRunner.hasColumn("trips", "created_at");
            if (!hasCreatedAt) {
                yield queryRunner.query(`ALTER TABLE trips ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            }
            const hasUpdatedAt = yield queryRunner.hasColumn("trips", "updated_at");
            if (!hasUpdatedAt) {
                yield queryRunner.query(`ALTER TABLE trips ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasUpdatedAt = yield queryRunner.hasColumn("trips", "updated_at");
            if (hasUpdatedAt) {
                yield queryRunner.query(`ALTER TABLE trips DROP COLUMN updated_at`);
            }
            const hasCreatedAt = yield queryRunner.hasColumn("trips", "created_at");
            if (hasCreatedAt) {
                yield queryRunner.query(`ALTER TABLE trips DROP COLUMN created_at`);
            }
        });
    }
}
exports.AddTimestampsToTrips1756656805719 = AddTimestampsToTrips1756656805719;
