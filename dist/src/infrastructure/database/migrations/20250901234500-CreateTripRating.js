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
exports.CreateTripRating20250901234500 = void 0;
const typeorm_1 = require("typeorm");
class CreateTripRating20250901234500 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "trip_rating",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "name", type: "varchar", length: "100" },
                    { name: "comment", type: "text", isNullable: true },
                    { name: "rating", type: "decimal", precision: 3, scale: 2 },
                    { name: "images", type: "json", isNullable: true },
                    { name: "trip_id", type: "char", length: "36" },
                    { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                    { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                ],
            }));
            yield queryRunner.createForeignKey("trip_rating", new typeorm_1.TableForeignKey({
                columnNames: ["trip_id"],
                referencedTableName: "trips",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("trip_rating");
            if (table) {
                for (const fk of table.foreignKeys) {
                    if (fk.columnNames.includes("trip_id")) {
                        yield queryRunner.dropForeignKey("trip_rating", fk);
                    }
                }
            }
            yield queryRunner.dropTable("trip_rating");
        });
    }
}
exports.CreateTripRating20250901234500 = CreateTripRating20250901234500;
