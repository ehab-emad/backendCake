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
exports.CreateClients20240101000003 = void 0;
const typeorm_1 = require("typeorm");
class CreateClients20240101000003 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "clients",
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
                    { name: "name", type: "varchar", length: "100" },
                    { name: "email", type: "varchar", length: "255", isUnique: true },
                    { name: "address", type: "varchar", length: "255", isNullable: true },
                    { name: "phone", type: "varchar", length: "20", isNullable: true },
                    {
                        name: "profile_image",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "license_number",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "website_url",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "additional_phone_number",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "subscription_type",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    { name: "rating", type: "decimal", precision: 4, scale: 2, default: 0, isNullable: true },
                    { name: "approved", type: "boolean", default: false },
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
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("clients", true);
        });
    }
}
exports.CreateClients20240101000003 = CreateClients20240101000003;
