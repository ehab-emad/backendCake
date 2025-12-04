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
exports.CreateCustomers20240101000002 = void 0;
const typeorm_1 = require("typeorm");
class CreateCustomers20240101000002 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "customers",
                columns: [
                    {
                        name: "id",
                        type: "char",
                        length: "36",
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                        isPrimary: true,
                    },
                    { name: "status", type: "boolean", default: true },
                    {
                        name: "auth_user_id",
                        type: "char",
                        length: "36",
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                        isNullable: false,
                    },
                    {
                        name: "customer_type",
                        type: "enum",
                        enum: ["VIP", "Regular"],
                        default: "'Regular'",
                    },
                    {
                        name: "national_id",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "national_id_expiry",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "nationality",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'date_of_birth',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'gender',
                        type: 'varchar',
                        length: '20',
                        isNullable: true,
                    },
                    {
                        name: 'latitude',
                        type: 'decimal',
                        precision: 10,
                        scale: 7,
                        isNullable: true,
                    },
                    {
                        name: 'longitude',
                        type: 'decimal',
                        precision: 10,
                        scale: 7,
                        isNullable: true,
                    },
                    {
                        name: "passport_number",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "phone_number",
                        type: "varchar",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "passport_expiry",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "address_line1",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "address_line2",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "country",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "registration_date",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "expiration_date",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }), true);
            yield queryRunner.createForeignKey("customers", new typeorm_1.TableForeignKey({
                columnNames: ["auth_user_id"],
                referencedTableName: "auth_users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("customers");
            if (table) {
                const fk = table.foreignKeys.find((fk) => fk.columnNames.includes("auth_user_id"));
                if (fk)
                    yield queryRunner.dropForeignKey("customers", fk);
            }
            yield queryRunner.dropTable("customers");
        });
    }
}
exports.CreateCustomers20240101000002 = CreateCustomers20240101000002;
