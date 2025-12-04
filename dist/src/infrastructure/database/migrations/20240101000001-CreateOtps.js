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
exports.CreateOtps20240101000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateOtps20240101000001 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "otps",
                engine: "InnoDB",
                columns: [
                    {
                        name: "id",
                        type: "char",
                        length: "36",
                        isPrimary: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "user_id",
                        type: "char",
                        length: "36",
                        isNullable: false,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    { name: "hash", type: "varchar", length: "255" },
                    { name: "expires_at", type: "datetime" },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield q.createForeignKey("otps", new typeorm_1.TableForeignKey({
                columnNames: ["user_id"],
                referencedTableName: "auth_users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("otps");
            const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("user_id"));
            if (fk)
                yield q.dropForeignKey("otps", fk);
            yield q.dropTable("otps");
        });
    }
}
exports.CreateOtps20240101000001 = CreateOtps20240101000001;
