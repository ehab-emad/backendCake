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
exports.CreateAuth20240101000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateAuth20240101000000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "auth_users",
                columns: [
                    {
                        name: "id",
                        type: "char",
                        length: "36",
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                        isPrimary: true,
                    },
                    {
                        name: "first_name",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "last_name",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                        isNullable: true,
                    },
                    {
                        name: "phone_number",
                        type: "varchar",
                        length: "20",
                        isUnique: true,
                        isNullable: true,
                    },
                    {
                        name: "password_hash",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "provider",
                        type: "enum",
                        enum: ["local", "google", "apple", "phone"],
                        default: "'local'",
                    },
                    {
                        name: "provider_id",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "phone_verified",
                        type: "boolean",
                        default: false,
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
            yield queryRunner.createIndex("auth_users", new typeorm_1.TableIndex({
                name: "IDX_AUTH_USER_EMAIL",
                columnNames: ["email"],
            }));
            yield queryRunner.createIndex("auth_users", new typeorm_1.TableIndex({
                name: "IDX_AUTH_USER_PHONE",
                columnNames: ["phone_number"],
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropIndex("auth_users", "IDX_AUTH_USER_PHONE");
            yield queryRunner.dropIndex("auth_users", "IDX_AUTH_USER_EMAIL");
            yield queryRunner.dropTable("auth_users");
        });
    }
}
exports.CreateAuth20240101000000 = CreateAuth20240101000000;
