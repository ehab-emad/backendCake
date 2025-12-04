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
exports.UpdateRoomsTable20240101000026 = void 0;
const typeorm_1 = require("typeorm");
const columnsToAdd = [
    {
        name: 'room_category',
        type: 'enum',
        enum: ['Single', 'Double', 'Suite'],
        default: 'Single',
        isNullable: false,
        after: 'room_type'
    },
    {
        name: 'max_occupancy',
        type: 'int',
        isNullable: false,
        after: 'room_category'
    },
    {
        name: 'single_bed_count',
        type: 'int',
        default: 0,
        isNullable: false,
        after: 'max_occupancy'
    },
    {
        name: 'double_bed_count',
        type: 'int',
        default: 0,
        isNullable: false,
        after: 'single_bed_count'
    },
    {
        name: 'available_quantity',
        type: 'int',
        isNullable: false,
        after: 'double_bed_count'
    },
    {
        name: 'description',
        type: 'text',
        isNullable: true,
        after: 'view'
    },
    {
        name: 'floor_type',
        type: 'varchar',
        length: '50',
        isNullable: true,
        after: 'description'
    }
];
class UpdateRoomsTable20240101000026 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableExists = yield queryRunner.hasTable('rooms');
            if (tableExists) {
                // First add all non-enum columns
                const table = yield queryRunner.getTable('rooms');
                if (table) {
                    for (const columnDef of columnsToAdd) {
                        // Skip room_category for now - we'll handle it separately
                        if (columnDef.name === 'room_category')
                            continue;
                        const column = table.columns.find(col => col.name === columnDef.name);
                        if (!column) {
                            const newColumn = new typeorm_1.TableColumn({
                                name: columnDef.name,
                                type: columnDef.type,
                                isNullable: columnDef.isNullable !== false,
                                default: columnDef.default,
                                length: columnDef.length
                            });
                            yield queryRunner.addColumn('rooms', newColumn);
                            console.log(`Added column ${columnDef.name} to rooms table`);
                        }
                    }
                    // Add room_category using raw SQL to ensure proper enum syntax
                    const roomCategoryColumn = table.columns.find(col => col.name === 'room_category');
                    if (!roomCategoryColumn) {
                        yield queryRunner.query(`
            ALTER TABLE rooms 
            ADD COLUMN room_category ENUM('Single', 'Double', 'Suite') 
            NOT NULL DEFAULT 'Single' 
            AFTER room_type
          `);
                        console.log('Added column room_category to rooms table');
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
exports.UpdateRoomsTable20240101000026 = UpdateRoomsTable20240101000026;
