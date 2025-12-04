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
exports.CreateFlightRating20240101000026 = void 0;
const typeorm_1 = require("typeorm");
class CreateFlightRating20240101000026 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "flight_rating",
                engine: "InnoDB",
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
                        name: "flight_id",
                        type: "char",
                        length: "36",
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
            // Add foreign key
            yield queryRunner.createForeignKey("flight_rating", new typeorm_1.TableForeignKey({
                columnNames: ["flight_id"],
                referencedTableName: "flights",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            }));
            // Add index for better query performance
            yield queryRunner.createIndex("flight_rating", new typeorm_1.TableIndex({
                name: "IDX_FLIGHT_RATING_FLIGHT_ID",
                columnNames: ["flight_id"],
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("flight_rating", true);
        });
    }
}
exports.CreateFlightRating20240101000026 = CreateFlightRating20240101000026;
