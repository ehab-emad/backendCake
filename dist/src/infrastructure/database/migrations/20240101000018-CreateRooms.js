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
exports.CreateRooms20240101000018 = void 0;
const typeorm_1 = require("typeorm");
class CreateRooms20240101000018 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "rooms",
                engine: "InnoDB",
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
                    { name: "hotel_id", type: "char", length: "36", isNullable: false },
                    { name: "status", type: "boolean", default: true },
                    { name: "room_name", type: "varchar", length: "255" },
                    { name: "price_per_night", type: "decimal", precision: 10, scale: 2 },
                    { name: "rating", type: "decimal", precision: 3, scale: 2, default: 0 },
                    { name: "room_type", type: "varchar", length: "100" },
                    { name: "available_rooms", type: "int" },
                    { name: "number_of_beds", type: "int" },
                    { name: "number_of_guests", type: "int" },
                    { name: "room_size", type: "varchar", length: "50" },
                    { name: "view", type: "varchar", length: "100" },
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
            yield q.createForeignKey("rooms", new typeorm_1.TableForeignKey({
                columnNames: ["client_id"],
                referencedTableName: "clients",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
            yield q.createForeignKey("rooms", new typeorm_1.TableForeignKey({
                columnNames: ["hotel_id"],
                referencedTableName: "hotels",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("rooms");
            if (table) {
                for (const fk of table.foreignKeys.filter((fk) => ["client_id", "hotel_id"].includes(fk.columnNames[0]))) {
                    yield q.dropForeignKey("rooms", fk);
                }
                yield q.dropTable("rooms");
            }
        });
    }
}
exports.CreateRooms20240101000018 = CreateRooms20240101000018;
