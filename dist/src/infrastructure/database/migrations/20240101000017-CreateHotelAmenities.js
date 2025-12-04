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
exports.CreateHotelAmenities20240101000017 = void 0;
const typeorm_1 = require("typeorm");
class CreateHotelAmenities20240101000017 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "hotel_amenities",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "hotel_id", type: "char", length: "36" },
                    { name: "name", type: "varchar", length: "100" },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield q.createForeignKey("hotel_amenities", new typeorm_1.TableForeignKey({
                columnNames: ["hotel_id"],
                referencedTableName: "hotels",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("hotel_amenities");
            if (table) {
                const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("hotel_id"));
                if (fk) {
                    yield q.dropForeignKey("hotel_amenities", fk);
                }
                yield q.dropTable("hotel_amenities");
            }
        });
    }
}
exports.CreateHotelAmenities20240101000017 = CreateHotelAmenities20240101000017;
