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
exports.CreateHotelRatings20250101000005 = void 0;
const typeorm_1 = require("typeorm");
class CreateHotelRatings20250101000005 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "hotel_rating",
                columns: [
                    {
                        name: "id",
                        type: "char",
                        length: "36",
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "comment",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "rating",
                        type: "decimal",
                        precision: 3,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "images",
                        type: "json",
                        isNullable: true,
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
                    {
                        name: "hotel_id",
                        type: "char",
                        length: "36",
                        isNullable: false,
                    },
                ],
            }), true);
            // Add foreign key constraint
            yield queryRunner.createForeignKey("hotel_rating", new typeorm_1.TableForeignKey({
                columnNames: ["hotel_id"],
                referencedTableName: "hotels",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("hotel_rating");
            if (table) {
                const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("hotel_id") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("hotel_rating", foreignKey);
                }
                yield queryRunner.dropTable("hotel_rating");
            }
        });
    }
}
exports.CreateHotelRatings20250101000005 = CreateHotelRatings20250101000005;
