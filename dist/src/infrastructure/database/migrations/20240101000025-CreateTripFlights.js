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
exports.CreateTripFlights20240101000025 = void 0;
const typeorm_1 = require("typeorm");
class CreateTripFlights20240101000025 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "trip_flights",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "trip_id", type: "char", length: "36" },
                    { name: "flight_id", type: "char", length: "36" },
                ],
            }), true);
            yield q.createForeignKey("trip_flights", new typeorm_1.TableForeignKey({
                columnNames: ["trip_id"],
                referencedTableName: "trips",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
            yield q.createForeignKey("trip_flights", new typeorm_1.TableForeignKey({
                columnNames: ["flight_id"],
                referencedTableName: "flights",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("trip_flights");
            if (table) {
                for (const fk of table.foreignKeys.filter((fk) => ["trip_id", "flight_id"].includes(fk.columnNames[0]))) {
                    yield q.dropForeignKey("trip_flights", fk);
                }
            }
            yield q.dropTable("trip_flights");
        });
    }
}
exports.CreateTripFlights20240101000025 = CreateTripFlights20240101000025;
