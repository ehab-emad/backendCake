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
exports.CreateTrips20240101000021 = void 0;
const typeorm_1 = require("typeorm");
class CreateTrips20240101000021 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "trips",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    {
                        name: "client_id",
                        type: "char",
                        length: "36",
                        isNullable: false,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    { name: "status", type: "boolean", default: true },
                    { name: "departure", type: "varchar", length: "255" },
                    { name: "name", type: "varchar", length: "255", isNullable: true },
                    { name: "arrival", type: "varchar", length: "255" },
                    { name: "trip_duration", type: "varchar", length: "50" },
                    { name: "includes_hotel", type: "boolean", default: false },
                    { name: "includes_flight", type: "boolean", default: false },
                    { name: "description", type: "text", isNullable: true },
                    { name: "price", type: "decimal", precision: 10, scale: 2, default: 0 },
                    { name: "days", type: "int", default: 1 },
                    { name: "departure_date", type: "date" },
                    { name: "includeProgram", type: "char", length: "36", isNullable: true },
                    { name: "noIncludeProgram", type: "char", length: "36", isNullable: true },
                    { name: "return_date", type: "date" },
                    { name: "rating", type: "decimal", precision: 4, scale: 2, default: 0 },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield q.createForeignKey("trips", new typeorm_1.TableForeignKey({
                columnNames: ["client_id"],
                referencedTableName: "clients",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("trips");
            if (table) {
                const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("client_id"));
                if (fk)
                    yield q.dropForeignKey("trips", fk);
            }
            yield q.dropTable("trips");
        });
    }
}
exports.CreateTrips20240101000021 = CreateTrips20240101000021;
