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
exports.AddAverageRatingToFlights20250101000004 = void 0;
const typeorm_1 = require("typeorm");
class AddAverageRatingToFlights20250101000004 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check if the column already exists
            const table = yield queryRunner.getTable('flights');
            const columnExists = table === null || table === void 0 ? void 0 : table.columns.some(column => column.name === 'average_rating');
            if (!columnExists) {
                yield queryRunner.addColumn('flights', new typeorm_1.TableColumn({
                    name: 'average_rating',
                    type: 'decimal',
                    precision: 3,
                    scale: 2,
                    isNullable: true,
                    default: null,
                    comment: 'Average rating calculated from flight_ratings table',
                }));
                console.log('Added average_rating column to flights table');
            }
            else {
                console.log('average_rating column already exists in flights table');
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the column exists before trying to drop it
            const table = yield queryRunner.getTable('flights');
            const columnExists = table === null || table === void 0 ? void 0 : table.columns.some(column => column.name === 'average_rating');
            if (columnExists) {
                yield queryRunner.dropColumn('flights', 'average_rating');
                console.log('Dropped average_rating column from flights table');
            }
            else {
                console.log('average_rating column does not exist in flights table');
            }
        });
    }
}
exports.AddAverageRatingToFlights20250101000004 = AddAverageRatingToFlights20250101000004;
