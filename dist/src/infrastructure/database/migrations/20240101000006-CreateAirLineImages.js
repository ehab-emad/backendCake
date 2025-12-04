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
exports.CreateAirLineImages20240101000006 = void 0;
const typeorm_1 = require("typeorm");
class CreateAirLineImages20240101000006 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "air_line_images",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "air_line_id", type: "char", length: "36" },
                    { name: "path", type: "varchar", length: "512" },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield q.createForeignKey("air_line_images", new typeorm_1.TableForeignKey({
                columnNames: ["air_line_id"],
                referencedTableName: "air_lines",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("air_line_images");
            const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("air_line_id"));
            if (fk)
                yield q.dropForeignKey("air_line_images", fk);
            yield q.dropTable("air_line_images");
        });
    }
}
exports.CreateAirLineImages20240101000006 = CreateAirLineImages20240101000006;
