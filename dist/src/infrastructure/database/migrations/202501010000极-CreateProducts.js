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
exports.CreateProducts20250101000006 = void 0;
const typeorm_1 = require("typeorm");
class CreateProducts20250101000006 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "full_description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "price",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "stock_quantity",
                        type: "int",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "image_url",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "material",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "beads",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "length",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "weight",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "rating",
                        type: "decimal",
                        precision: 3,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "sales",
                        type: "int",
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "50",
                        default: "'نشط'",
                        isNullable: false,
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
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "product_images",
                columns: [
                    {
                        name: "image_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "product_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "image_url",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield queryRunner.createForeignKey("product_images", new typeorm_1.TableForeignKey({
                columnNames: ["product_id"],
                referencedTableName: "products",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("product_images");
            yield queryRunner.dropTable("products");
        });
    }
}
exports.CreateProducts20250101000006 = CreateProducts20250101000006;
