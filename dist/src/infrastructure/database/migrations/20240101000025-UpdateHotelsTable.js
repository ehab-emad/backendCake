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
exports.UpdateHotelsTable20240101000025 = void 0;
const typeorm_1 = require("typeorm");
const columnsToAdd = [
    {
        name: 'branch_name',
        type: 'varchar',
        length: '100',
        isNullable: true,
        after: 'name'
    },
    {
        name: 'contact_person',
        type: 'varchar',
        length: '100',
        isNullable: true,
        after: 'contact_number'
    },
    {
        name: 'contract_start_date',
        type: 'date',
        isNullable: true,
        after: 'commission_percentage'
    },
    {
        name: 'contract_end_date',
        type: 'date',
        isNullable: true,
        after: 'contract_start_date'
    },
    {
        name: 'general_amenities',
        type: 'text',
        isNullable: true,
        after: 'contract_end_date'
    },
    {
        name: 'dining_amenities',
        type: 'text',
        isNullable: true,
        after: 'general_amenities'
    },
    {
        name: 'wellness_amenities',
        type: 'text',
        isNullable: true,
        after: 'dining_amenities'
    },
    {
        name: 'business_amenities',
        type: 'text',
        isNullable: true,
        after: 'wellness_amenities'
    },
    {
        name: 'other_amenities',
        type: 'text',
        isNullable: true,
        after: 'business_amenities'
    },
    {
        name: 'image_urls',
        type: 'json',
        isNullable: true,
        after: 'other_amenities',
        comment: 'JSON array of image URLs'
    }
];
class UpdateHotelsTable20240101000025 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableExists = yield queryRunner.hasTable('hotels');
            if (tableExists) {
                // Add columns one by one if they don't exist
                const table = yield queryRunner.getTable('hotels');
                if (table) {
                    for (const columnDef of columnsToAdd) {
                        const column = table.columns.find(col => col.name === columnDef.name);
                        if (!column) {
                            const newColumn = new typeorm_1.TableColumn({
                                name: columnDef.name,
                                type: columnDef.type,
                                isNullable: columnDef.isNullable !== false,
                                comment: columnDef.comment,
                                length: columnDef.length
                            });
                            yield queryRunner.addColumn('hotels', newColumn);
                            console.log(`Added column ${columnDef.name} to hotels table`);
                        }
                    }
                }
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Safe down migration - won't drop columns to prevent data loss
            console.log('No destructive operations performed in down migration');
        });
    }
}
exports.UpdateHotelsTable20240101000025 = UpdateHotelsTable20240101000025;
