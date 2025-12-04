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
exports.CreateHotels20240101000015 = void 0;
const typeorm_1 = require("typeorm");
class CreateHotels20240101000015 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "hotels",
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
                    { name: "price", type: "decimal", precision: 10, scale: 2, default: 0 },
                    { name: "rating", type: "decimal", precision: 4, scale: 2, default: 0 },
                    { name: "name", type: "varchar", length: "255", isNullable: false },
                    { name: "branch_name", type: "varchar", length: "100", isNullable: true },
                    { name: "contact_number", type: "varchar", length: "20", isNullable: true },
                    { name: "contact_person", type: "varchar", length: "100", isNullable: true },
                    { name: "country", type: "varchar", length: "50", isNullable: true },
                    { name: "city", type: "varchar", length: "50", isNullable: true },
                    { name: "address", type: "text", isNullable: true },
                    { name: "longitude", type: "decimal", precision: 10, scale: 7, isNullable: true },
                    { name: "latitude", type: "decimal", precision: 10, scale: 7, isNullable: true },
                    { name: "description", type: "text", isNullable: true },
                    { name: "map", type: "varchar", isNullable: true },
                    {
                        name: "commission_rate",
                        type: "decimal",
                        precision: 5,
                        scale: 2,
                        default: 0.0,
                        isNullable: false
                    },
                    { name: "contract_start_date", type: "date", isNullable: true },
                    { name: "contract_end_date", type: "date", isNullable: true },
                    { name: "general_amenities", type: "text", isNullable: true },
                    { name: "dining_amenities", type: "text", isNullable: true },
                    { name: "wellness_amenities", type: "text", isNullable: true },
                    { name: "business_amenities", type: "text", isNullable: true },
                    { name: "other_amenities", type: "text", isNullable: true },
                    { name: "image_urls", type: "json", isNullable: true },
                    { name: "meals", type: "json", isNullable: true },
                    { name: "unlimited_internet", type: "json", isNullable: true },
                    { name: "airport_transfer", type: "json", isNullable: true },
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
            yield q.createForeignKey("hotels", new typeorm_1.TableForeignKey({
                columnNames: ["client_id"],
                referencedTableName: "clients",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("hotels");
            if (table) {
                const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("client_id"));
                if (fk) {
                    yield q.dropForeignKey("hotels", fk);
                }
                yield q.dropTable("hotels");
            }
        });
    }
}
exports.CreateHotels20240101000015 = CreateHotels20240101000015;
