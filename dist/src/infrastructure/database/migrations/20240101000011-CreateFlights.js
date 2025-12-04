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
exports.CreateFlights20240101000011 = void 0;
const typeorm_1 = require("typeorm");
class CreateFlights20240101000011 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "flights",
                engine: "InnoDB",
                columns: [
                    { name: "id", type: "char", length: "36", isPrimary: true },
                    { name: "status", type: "boolean", default: true },
                    { name: "airline_id", type: "char", length: "36" },
                    {
                        name: "client_id",
                        type: "char",
                        length: "36",
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "rating",
                        type: "decimal",
                        precision: 4,
                        scale: 2,
                        default: 0,
                        isNullable: true
                    },
                    {
                        name: "departure_city",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "arrival_city",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "flight_number",
                        type: "varchar",
                        length: "20",
                        isNullable: true
                    },
                    {
                        name: "number_of_stops",
                        type: "int"
                    },
                    {
                        name: "gate",
                        type: "varchar",
                        length: "10",
                        isNullable: true
                    },
                    {
                        name: "flight_date",
                        type: "date"
                    },
                    {
                        name: "return_date",
                        type: "date"
                    },
                    {
                        name: "departure_time",
                        type: "time"
                    },
                    {
                        name: "arrival_time",
                        type: "time"
                    },
                    {
                        name: "transit",
                        type: "boolean",
                        default: false,
                        isNullable: false
                    },
                    {
                        name: "rest",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "flight_duration",
                        type: "int"
                    },
                    {
                        name: "available_seats",
                        type: "int",
                        isNullable: true
                    },
                    {
                        name: "booking_class",
                        type: "varchar",
                        length: "50"
                    },
                    {
                        name: "in_flight_entertainment",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "usb_port_outlet",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "price",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true
                    },
                    {
                        name: "discount",
                        type: "decimal",
                        precision: 5,
                        scale: 2,
                        default: 0,
                        isNullable: true
                    },
                    {
                        name: "aircraft_type",
                        type: "varchar",
                        length: "50"
                    },
                    {
                        name: "seat_layout",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "seat_pitch",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "aircraft_image",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "currency",
                        type: "varchar",
                        length: "10",
                        default: "'AED'"
                    },
                    {
                        name: "departureIata",
                        type: "varchar",
                        length: "10",
                        isNullable: true,
                        default: null
                    },
                    {
                        name: "arrivalIata",
                        type: "varchar",
                        length: "10",
                        isNullable: true,
                        default: null
                    },
                    {
                        name: "is_suggested",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "meals",
                        type: "json",
                        isNullable: true,
                        comment: "JSON array of meal options with name and price"
                    },
                    {
                        name: "unlimited_internet",
                        type: "json",
                        isNullable: true,
                        comment: "JSON array of unlimited internet options"
                    },
                    {
                        name: "airport_transfer",
                        type: "json",
                        isNullable: true,
                        comment: "JSON array of airport transfer options"
                    },
                    {
                        name: "extra_baggage",
                        type: "json",
                        isNullable: true,
                        comment: "JSON array of extra baggage options"
                    },
                    {
                        name: "seats",
                        type: "json",
                        isNullable: true,
                        comment: "JSON array of seat options"
                    },
                    {
                        name: "transitFlights",
                        type: "json",
                        isNullable: true,
                        comment: "JSON array of nested transit flights"
                    },
                    {
                        name: "returnFlights",
                        type: "json",
                        isNullable: true,
                        comment: "JSON array of nested return flights"
                    },
                    {
                        name: "all_seats",
                        type: "int",
                        isNullable: true,
                        comment: "Number of all seats"
                    },
                ],
            }), true);
            yield q.createForeignKey("flights", new typeorm_1.TableForeignKey({
                columnNames: ["client_id"],
                referencedTableName: "clients",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
            yield q.createForeignKey("flights", new typeorm_1.TableForeignKey({
                columnNames: ["airline_id"],
                referencedTableName: "air_lines",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield q.getTable("flights");
            if (table) {
                for (const fk of table.foreignKeys.filter((fk) => ["client_id", "airline_id"].includes(fk.columnNames[0]))) {
                    yield q.dropForeignKey("flights", fk);
                }
            }
            yield q.dropTable("flights");
        });
    }
}
exports.CreateFlights20240101000011 = CreateFlights20240101000011;
