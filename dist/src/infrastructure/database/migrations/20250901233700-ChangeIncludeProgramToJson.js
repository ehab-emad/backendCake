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
exports.ChangeIncludeProgramToJson20250901233700 = void 0;
class ChangeIncludeProgramToJson20250901233700 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasTable = yield queryRunner.hasTable("trips");
            if (!hasTable)
                return;
            // Try to switch columns to JSON (MySQL 5.7+/MariaDB 10.2+). Fallbacks may be needed on older versions.
            yield queryRunner.query(`ALTER TABLE trips MODIFY includeProgram JSON NULL`);
            yield queryRunner.query(`ALTER TABLE trips MODIFY noIncludeProgram JSON NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasTable = yield queryRunner.hasTable("trips");
            if (!hasTable)
                return;
            // Revert to previous definition (char(36)) if needed
            yield queryRunner.query(`ALTER TABLE trips MODIFY includeProgram CHAR(36) NULL`);
            yield queryRunner.query(`ALTER TABLE trips MODIFY noIncludeProgram CHAR(36) NULL`);
        });
    }
}
exports.ChangeIncludeProgramToJson20250901233700 = ChangeIncludeProgramToJson20250901233700;
