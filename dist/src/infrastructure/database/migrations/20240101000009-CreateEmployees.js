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
exports.CreateEmployees20240101000009 = void 0;
const typeorm_1 = require("typeorm");
class CreateEmployees20240101000009 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "employees",
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
                    {
                        name: "auth_user_id",
                        type: "char",
                        length: "36",
                        isNullable: false,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "address",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "profile_image",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    { name: "role", type: "varchar", length: "100" },
                    { name: "active", type: "boolean", default: true },
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
            yield q.createForeignKey("employees", new typeorm_1.TableForeignKey({
                columnNames: ["client_id"],
                referencedTableName: "clients",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
            yield q.createForeignKey("employees", new typeorm_1.TableForeignKey({
                columnNames: ["auth_user_id"],
                referencedTableName: "auth_users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("employees");
            for (const fk of table.foreignKeys.filter((fk) => ["client_id", "auth_user_id"].includes(fk.columnNames[0]))) {
                yield q.dropForeignKey("employees", fk);
            }
            yield q.dropTable("employees");
        });
    }
}
exports.CreateEmployees20240101000009 = CreateEmployees20240101000009;
