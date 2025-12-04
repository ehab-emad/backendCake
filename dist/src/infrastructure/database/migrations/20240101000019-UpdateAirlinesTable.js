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
exports.UpdateAirlinesTable20240101000019 = void 0;
const typeorm_1 = require("typeorm");
const columnsToAdd = [
    {
        name: 'airline_name',
        type: 'varchar',
        length: '100',
        isNullable: false,
        after: 'status'
    },
    {
        name: 'airline_type',
        type: 'enum',
        enum: ['International', 'Domestic', 'Both'],
        isNullable: false,
        after: 'airline_name'
    },
    {
        name: 'is_charter',
        type: 'tinyint',
        default: 0,
        isNullable: false,
        after: 'airline_type'
    },
    {
        name: 'contract_start_date',
        type: 'date',
        isNullable: true,
        after: 'is_charter'
    },
    {
        name: 'contract_end_date',
        type: 'date',
        isNullable: true,
        after: 'contract_start_date'
    },
    {
        name: 'additional_services',
        type: 'text',
        isNullable: true,
        after: 'contract_end_date'
    },
    {
        name: 'special_amenities',
        type: 'text',
        isNullable: true,
        after: 'additional_services'
    },
    {
        name: 'logo_url',
        type: 'varchar',
        length: '255',
        isNullable: true,
        comment: 'URL for airline logo image',
        after: 'special_amenities'
    },
    {
        name: 'promotional_images',
        type: 'json',
        isNullable: true,
        comment: 'JSON array of additional promotional image URLs',
        after: 'logo_url'
    },
    {
        name: 'documents',
        type: 'json',
        isNullable: true,
        comment: 'JSON array of contract/document image URLs',
        after: 'promotional_images'
    }
];
class UpdateAirlinesTable20240101000019 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableExists = yield queryRunner.hasTable('air_lines');
            if (tableExists) {
                // Add columns one by one if they don't exist
                const table = yield queryRunner.getTable('air_lines');
                if (table) {
                    for (const columnDef of columnsToAdd) {
                        const column = table.columns.find(col => col.name === columnDef.name);
                        if (!column) {
                            const newColumn = new typeorm_1.TableColumn({
                                name: columnDef.name,
                                type: columnDef.type,
                                isNullable: columnDef.isNullable !== false,
                                default: columnDef.default,
                                comment: columnDef.comment,
                                enum: columnDef.enum,
                                length: columnDef.length
                            });
                            yield queryRunner.addColumn('air_lines', newColumn);
                            console.log(`Added column ${columnDef.name} to air_lines table`);
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
exports.UpdateAirlinesTable20240101000019 = UpdateAirlinesTable20240101000019;
