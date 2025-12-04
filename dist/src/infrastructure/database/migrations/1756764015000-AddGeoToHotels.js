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
exports.AddGeoToHotels1756764015000 = void 0;
class AddGeoToHotels1756764015000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasLat = yield queryRunner.hasColumn("hotels", "latitude");
            if (!hasLat) {
                yield queryRunner.query(`ALTER TABLE hotels ADD COLUMN latitude DECIMAL(10,7) NULL`);
            }
            const hasLng = yield queryRunner.hasColumn("hotels", "longitude");
            if (!hasLng) {
                yield queryRunner.query(`ALTER TABLE hotels ADD COLUMN longitude DECIMAL(10,7) NULL`);
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasLng = yield queryRunner.hasColumn("hotels", "longitude");
            if (hasLng) {
                yield queryRunner.query(`ALTER TABLE hotels DROP COLUMN longitude`);
            }
            const hasLat = yield queryRunner.hasColumn("hotels", "latitude");
            if (hasLat) {
                yield queryRunner.query(`ALTER TABLE hotels DROP COLUMN latitude`);
            }
        });
    }
}
exports.AddGeoToHotels1756764015000 = AddGeoToHotels1756764015000;
