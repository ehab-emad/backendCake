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
exports.CreateEmployeeImages20240101000010 = void 0;
const typeorm_1 = require("typeorm");
class CreateEmployeeImages20240101000010 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "employee_images",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    {
                        name: "employee_id",
                        type: "char",
                        length: "36",
                        isNullable: false,
                    },
                    { name: "path", type: "varchar", length: "255" },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield q.createForeignKey("employee_images", new typeorm_1.TableForeignKey({
                columnNames: ["employee_id"],
                referencedTableName: "employees",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("employee_images");
            const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("employee_id"));
            if (fk)
                yield q.dropForeignKey("employee_images", fk);
            yield q.dropTable("employee_images");
        });
    }
}
exports.CreateEmployeeImages20240101000010 = CreateEmployeeImages20240101000010;
