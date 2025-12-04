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
exports.AddCommissionRateToHotels20240101000027 = void 0;
const typeorm_1 = require("typeorm");
class AddCommissionRateToHotels20240101000027 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable('hotels');
            if (table) {
                // Check if commission_rate column doesn't exist
                const commissionRateColumn = table.columns.find(column => column.name === 'commission_rate');
                if (!commissionRateColumn) {
                    // Add the new commission_rate column
                    yield queryRunner.addColumn('hotels', new typeorm_1.TableColumn({
                        name: 'commission_rate',
                        type: 'decimal',
                        precision: 5,
                        scale: 2,
                        default: 0.0,
                        isNullable: false,
                        comment: 'Commission rate for the hotel'
                    }));
                    console.log('Added commission_rate column to hotels table');
                }
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Safe down migration - don't drop the column to prevent data loss
            console.log('No destructive operations performed in down migration');
        });
    }
}
exports.AddCommissionRateToHotels20240101000027 = AddCommissionRateToHotels20240101000027;
