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
exports.CreateDeviceTokens20240101000029 = void 0;
const typeorm_1 = require("typeorm");
class CreateDeviceTokens20240101000029 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "device_tokens",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                        isNullable: false,
                    },
                    {
                        name: "auth_user_id",
                        type: "char",
                        length: "36",
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                        isNullable: false,
                    },
                    {
                        name: "token",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield queryRunner.createForeignKey("device_tokens", new typeorm_1.TableForeignKey({
                name: "FK_device_tokens_auth",
                columnNames: ["auth_user_id"],
                referencedTableName: "auth_users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropForeignKey("device_tokens", "FK_device_tokens_auth");
            yield queryRunner.dropTable("device_tokens", true);
        });
    }
}
exports.CreateDeviceTokens20240101000029 = CreateDeviceTokens20240101000029;
