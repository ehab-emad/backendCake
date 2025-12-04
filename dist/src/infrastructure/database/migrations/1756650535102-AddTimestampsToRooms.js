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
exports.AddTimestampsToRooms1756650535102 = void 0;
class AddTimestampsToRooms1756650535102 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add created_at if missing
            const hasCreatedAt = yield queryRunner.hasColumn("rooms", "created_at");
            if (!hasCreatedAt) {
                yield queryRunner.query(`ALTER TABLE rooms ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            }
            // Add updated_at if missing
            const hasUpdatedAt = yield queryRunner.hasColumn("rooms", "updated_at");
            if (!hasUpdatedAt) {
                yield queryRunner.query(`ALTER TABLE rooms ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Drop updated_at if exists
            const hasUpdatedAt = yield queryRunner.hasColumn("rooms", "updated_at");
            if (hasUpdatedAt) {
                yield queryRunner.query(`ALTER TABLE rooms DROP COLUMN updated_at`);
            }
            // Drop created_at if exists
            const hasCreatedAt = yield queryRunner.hasColumn("rooms", "created_at");
            if (hasCreatedAt) {
                yield queryRunner.query(`ALTER TABLE rooms DROP COLUMN created_at`);
            }
        });
    }
}
exports.AddTimestampsToRooms1756650535102 = AddTimestampsToRooms1756650535102;
