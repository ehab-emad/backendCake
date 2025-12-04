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
exports.CreateTickets20240101000027 = void 0;
const typeorm_1 = require("typeorm");
class CreateTickets20240101000027 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "tickets",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "ticket_number", type: "varchar", length: "64" },
                    { name: "title", type: "varchar", length: "255" },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["open", "pending", "closed"],
                        default: "'open'",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield q.createTable(new typeorm_1.Table({
                name: "ticket_attachments",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "ticket_id", type: "char", length: "36" },
                    { name: "path", type: "varchar", length: "255" },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield q.createForeignKey("ticket_attachments", new typeorm_1.TableForeignKey({
                columnNames: ["ticket_id"],
                referencedTableName: "tickets",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const attTable = yield q.getTable("ticket_attachments");
            if (attTable) {
                for (const fk of attTable.foreignKeys) {
                    yield q.dropForeignKey("ticket_attachments", fk);
                }
                yield q.dropTable("ticket_attachments");
            }
            const table = yield q.getTable("tickets");
            if (table) {
                for (const fk of table.foreignKeys) {
                    yield q.dropForeignKey("tickets", fk);
                }
                yield q.dropTable("tickets");
            }
        });
    }
}
exports.CreateTickets20240101000027 = CreateTickets20240101000027;
