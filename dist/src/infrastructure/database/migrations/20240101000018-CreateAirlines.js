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
exports.CreateAirlines20240101000018 = void 0;
const typeorm_1 = require("typeorm");
class CreateAirlines20240101000018 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "air_lines",
                columns: [
                    {
                        name: "id",
                        type: "char",
                        length: "36",
                        isPrimary: true,
                    },
                    {
                        name: "client_id",
                        type: "char",
                        length: "36",
                        isNullable: false,
                    },
                    {
                        name: "company_name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "rating",
                        type: "decimal",
                        precision: 4,
                        scale: 2,
                        default: 0,
                        isNullable: true,
                    },
                    {
                        name: "phone_number",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "iata_code",
                        type: "varchar",
                        length: "10",
                        isNullable: false,
                    },
                    {
                        name: "country",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "flight_type",
                        type: "enum",
                        enum: ["international", "domestic"],
                        isNullable: false,
                    },
                    {
                        name: "meals_available",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "special_offers",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "collaboration_start_date",
                        type: "date",
                        isNullable: false,
                    },
                    {
                        name: "contract_duration",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "commission_rate",
                        type: "decimal",
                        precision: 5,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "airline_name",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "airline_type",
                        type: "enum",
                        enum: ["International", "Domestic", "Both"],
                        isNullable: false,
                    },
                    {
                        name: "is_charter",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "contract_start_date",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "contract_end_date",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "additional_services",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "special_amenities",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "logo_url",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "URL for airline logo image",
                    },
                    {
                        name: "promotional_images",
                        type: "json",
                        isNullable: true,
                        comment: "JSON array of additional promotional image URLs",
                    },
                    {
                        name: "documents",
                        type: "json",
                        isNullable: true,
                        comment: "JSON array of contract/document image URLs",
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
            // Create foreign key for client relationship if it doesn't exist
            const table = yield queryRunner.getTable('air_lines');
            if (table) {
                const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('client_id') !== -1);
                if (!foreignKey) {
                    yield queryRunner.createForeignKey('air_lines', new typeorm_1.TableForeignKey({
                        name: 'FK_airlines_client',
                        columnNames: ['client_id'],
                        referencedTableName: 'clients',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    }));
                }
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Drop foreign key first
            const table = yield queryRunner.getTable("air_lines");
            if (table) {
                const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("client_id") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("air_lines", foreignKey);
                }
            }
            // Then drop the table
            yield queryRunner.dropTable("air_lines");
        });
    }
}
exports.CreateAirlines20240101000018 = CreateAirlines20240101000018;
