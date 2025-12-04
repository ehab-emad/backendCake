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
exports.CreateAirLine20240101000005 = void 0;
const typeorm_1 = require("typeorm");
class CreateAirLine20240101000005 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "air_lines",
                engine: "InnoDB",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    {
                        name: "rating",
                        type: "decimal",
                        precision: 4,
                        scale: 2,
                        default: 0,
                        isNullable: true,
                    },
                    {
                        name: "client_id",
                        type: "char",
                        length: "36",
                        isNullable: false,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    { name: "company_name", type: "varchar", length: "255" },
                    { name: "phone_number", type: "varchar", length: "20" },
                    { name: "email", type: "varchar", length: "255" },
                    { name: "iata_code", type: "varchar", length: "10" },
                    { name: "country", type: "varchar", length: "100" },
                    { name: "city", type: "varchar", length: "100" },
                    {
                        name: "flight_type",
                        type: "enum",
                        enum: ["international", "domestic"],
                    },
                    { name: "airline_name", type: "varchar", length: "255" },
                    { name: "airline_type", type: "varchar", length: "255" },
                    { name: "meals_available", type: "boolean", default: false },
                    { name: "special_offers", type: "boolean", default: false },
                    { name: "collaboration_start_date", type: "date" },
                    { name: "contract_duration", type: "int" },
                    { name: "commission_rate", type: "decimal", precision: 5, scale: 2 },
                    { name: "status", type: "boolean", default: true },
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
            yield q.createForeignKey("air_lines", new typeorm_1.TableForeignKey({
                columnNames: ["client_id"],
                referencedTableName: "clients",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("air_lines");
            const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("client_id"));
            if (fk)
                yield q.dropForeignKey("air_lines", fk);
            yield q.dropTable("air_lines");
        });
    }
}
exports.CreateAirLine20240101000005 = CreateAirLine20240101000005;
