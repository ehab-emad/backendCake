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
exports.CreateFlightMeals20240101000014 = void 0;
const typeorm_1 = require("typeorm");
class CreateFlightMeals20240101000014 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "flight_meals",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "name", type: "varchar", length: "100" },
                    { name: "flight_id", type: "char", length: "36" },
                ],
            }), true);
            yield q.createForeignKey("flight_meals", new typeorm_1.TableForeignKey({
                columnNames: ["flight_id"],
                referencedTableName: "flights",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("flight_meals");
            if (table) {
                const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("flight_id"));
                if (fk)
                    yield q.dropForeignKey("flight_meals", fk);
            }
            yield q.dropTable("flight_meals");
        });
    }
}
exports.CreateFlightMeals20240101000014 = CreateFlightMeals20240101000014;
