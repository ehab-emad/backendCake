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
exports.CreateTicketMessages20240101000029 = void 0;
const typeorm_1 = require("typeorm");
class CreateTicketMessages20240101000029 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "ticket_messages",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "ticket_id", type: "char", length: "36" },
                    {
                        name: "client_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "user_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    { name: "message", type: "text" },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            const fk = (column, table) => new typeorm_1.TableForeignKey({
                columnNames: [column],
                referencedTableName: table,
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            });
            yield q.createForeignKey("ticket_messages", fk("ticket_id", "tickets"));
            yield q.createForeignKey("ticket_messages", fk("client_id", "clients"));
            yield q.createForeignKey("ticket_messages", fk("user_id", "auth_users"));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("ticket_messages");
            if (table) {
                for (const fk of table.foreignKeys) {
                    yield q.dropForeignKey("ticket_messages", fk);
                }
                yield q.dropTable("ticket_messages");
            }
        });
    }
}
exports.CreateTicketMessages20240101000029 = CreateTicketMessages20240101000029;
