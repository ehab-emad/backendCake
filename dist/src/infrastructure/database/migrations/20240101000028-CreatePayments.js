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
exports.CreatePayments20240501000000 = void 0;
const typeorm_1 = require("typeorm");
class CreatePayments20240501000000 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "payments",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    {
                        name: "process_number",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                    },
                    {
                        name: "reservation_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    { name: "category", type: "varchar", length: "50" },
                    {
                        name: "customer_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "client_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    { name: "transaction_status", type: "varchar", length: "20" },
                    { name: "amount", type: "decimal", precision: 10, scale: 2 },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
                engine: "InnoDB",
            }), true);
            const fk = (col, ref) => new typeorm_1.TableForeignKey({
                columnNames: [col],
                referencedTableName: ref,
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            });
            yield q.createForeignKey("payments", fk("reservation_id", "reservations"));
            yield q.createForeignKey("payments", fk("customer_id", "customers"));
            yield q.createForeignKey("payments", fk("client_id", "clients"));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("payments");
            if (table) {
                for (const fk of table.foreignKeys) {
                    yield q.dropForeignKey("payments", fk);
                }
            }
            yield q.dropTable("payments");
        });
    }
}
exports.CreatePayments20240501000000 = CreatePayments20240501000000;
