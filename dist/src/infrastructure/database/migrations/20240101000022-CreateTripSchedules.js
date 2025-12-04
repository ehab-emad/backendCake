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
exports.CreateTripSchedules20240101000022 = void 0;
const typeorm_1 = require("typeorm");
class CreateTripSchedules20240101000022 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "trip_schedules",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "trip_id", type: "char", length: "36" },
                    { name: "day", type: "int" },
                    { name: "title", type: "varchar", length: "255" },
                    { name: "description", type: "text" },
                ],
            }), true);
            yield q.createForeignKey("trip_schedules", new typeorm_1.TableForeignKey({
                columnNames: ["trip_id"],
                referencedTableName: "trips",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("trip_schedules");
            if (table) {
                const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("trip_id"));
                if (fk)
                    yield q.dropForeignKey("trip_schedules", fk);
            }
            yield q.dropTable("trip_schedules");
        });
    }
}
exports.CreateTripSchedules20240101000022 = CreateTripSchedules20240101000022;
