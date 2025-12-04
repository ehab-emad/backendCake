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
exports.CreateRoomImages20240101000019 = void 0;
const typeorm_1 = require("typeorm");
class CreateRoomImages20240101000019 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "room_images",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "room_id", type: "char", length: "36" },
                    { name: "path", type: "varchar", length: "512" },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield q.createForeignKey("room_images", new typeorm_1.TableForeignKey({
                columnNames: ["room_id"],
                referencedTableName: "rooms",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("room_images");
            if (table) {
                const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("room_id"));
                if (fk)
                    yield q.dropForeignKey("room_images", fk);
                yield q.dropTable("room_images");
            }
        });
    }
}
exports.CreateRoomImages20240101000019 = CreateRoomImages20240101000019;
