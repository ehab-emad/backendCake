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
exports.AddNewCustomerFields1753360206348 = void 0;
const typeorm_1 = require("typeorm");
class AddNewCustomerFields1753360206348 {
    columnExists(queryRunner, tableName, columnName) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable(tableName);
            return (table === null || table === void 0 ? void 0 : table.columns.some(column => column.name === columnName)) || false;
        });
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // List of columns to add with their configurations
            const columnsToAdd = [
                {
                    name: 'customer_type',
                    type: 'enum',
                    enum: ['VIP', 'Regular'],
                    default: '\'Regular\'',
                    isNullable: false
                },
                { name: "status", type: "boolean", default: true },
                { name: 'nationality', type: 'varchar', length: '50', isNullable: true },
                { name: 'name', type: 'varchar', length: '255', isNullable: true },
                { name: 'email', type: 'varchar', length: '255', isNullable: true },
                { name: 'gender', type: 'varchar', length: '20', isNullable: true },
                { name: 'latitude', type: 'decimal', precision: 10, scale: 7, isNullable: true },
                { name: 'longitude', type: 'decimal', precision: 10, scale: 7, isNullable: true },
                { name: 'date_of_birth', type: 'date', isNullable: true },
                { name: 'passport_expiry', type: 'date', isNullable: true },
                { name: 'phone_number', type: 'varchar', length: '20', isNullable: true },
                { name: 'first_name', type: 'varchar', length: '100', isNullable: true },
                { name: 'last_name', type: 'varchar', length: '100', isNullable: true },
                { name: 'locale', type: 'varchar', length: '10', isNullable: true },
                { name: "latitude", type: "decimal", precision: 10, scale: 7, isNullable: true },
                { name: "longitude", type: "decimal", precision: 10, scale: 7, isNullable: true },
                { name: 'profile_picture', type: 'varchar', length: '255', isNullable: true },
                { name: 'passport_number', type: 'varchar', length: '50', isNullable: true },
                { name: 'address_line1', type: 'varchar', length: '255', isNullable: true },
                { name: 'address_line2', type: 'varchar', length: '255', isNullable: true },
                { name: 'city', type: 'varchar', length: '100', isNullable: true },
                { name: 'country', type: 'varchar', length: '100', isNullable: true },
                { name: 'registration_date', type: 'date', isNullable: true },
                { name: 'expiration_date', type: 'date', isNullable: true },
                { name: 'customername', type: 'varchar', length: '100', isNullable: true },
                { name: 'email', type: 'varchar', length: '150', isNullable: true },
            ];
            // Add each column if it doesn't exist
            for (const column of columnsToAdd) {
                const columnExists = yield this.columnExists(queryRunner, 'customers', column.name);
                if (!columnExists) {
                    const tableColumn = new typeorm_1.TableColumn({
                        name: column.name,
                        type: column.type,
                        isNullable: column.isNullable,
                        default: column.default
                    });
                    // Handle enum type specifically
                    if (column.type === 'enum' && column.enum) {
                        tableColumn.enum = column.enum;
                    }
                    // Handle length for varchar
                    if (column.type === 'varchar' && column.length) {
                        tableColumn.length = column.length;
                    }
                    yield queryRunner.addColumn('customers', tableColumn);
                    console.log(`Added column: ${column.name}`);
                }
                else {
                    console.log(`Column ${column.name} already exists, skipping...`);
                }
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // List of columns that might have been added (in reverse order for proper rollback)
            const columnsToDrop = [
                'email',
                'status',
                'customername',
                'expiration_date',
                'registration_date',
                'first_name',
                'last_name',
                'locale',
                'profile_picture',
                'latitude',
                'longitude',
                'gender',
                'phone_number',
                'name',
                'date_of_birth',
                'passport_expiry',
                'passport_number',
                'nationality',
                'customer_type'
            ];
            // Drop each column if it exists
            for (const columnName of columnsToDrop) {
                const columnExists = yield this.columnExists(queryRunner, 'customers', columnName);
                if (columnExists) {
                    yield queryRunner.dropColumn('customers', columnName);
                    console.log(`Dropped column: ${columnName}`);
                }
                else {
                    console.log(`Column ${columnName} doesn't exist, skipping...`);
                }
            }
        });
    }
}
exports.AddNewCustomerFields1753360206348 = AddNewCustomerFields1753360206348;
