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
exports.CreateTripHotels20240101000024 = void 0;
const typeorm_1 = require("typeorm");
class CreateTripHotels20240101000024 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "trip_hotels",
                columns: [
                    {
                        name: "id",
                        type: "char",
                        length: "36",
                        isPrimary: true,
                    },
                    {
                        name: "trip_id",
                        type: "char",
                        length: "36",
                        isNullable: false,
                    },
                    {
                        name: "hotel_id",
                        type: "char",
                        length: "36",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            yield queryRunner.createForeignKey("trip_hotels", new typeorm_1.TableForeignKey({
                columnNames: ["trip_id"],
                referencedTableName: "trips",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
            yield queryRunner.createForeignKey("trip_hotels", new typeorm_1.TableForeignKey({
                columnNames: ["hotel_id"],
                referencedTableName: "hotels",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("trip_hotels");
            if (!table)
                return;
            for (const fk of table.foreignKeys) {
                if (fk.columnNames.indexOf("trip_id") !== -1 ||
                    fk.columnNames.indexOf("hotel_id") !== -1) {
                    yield queryRunner.dropForeignKey("trip_hotels", fk);
                }
            }
            yield queryRunner.dropTable("trip_hotels");
        });
    }
}
exports.CreateTripHotels20240101000024 = CreateTripHotels20240101000024;
