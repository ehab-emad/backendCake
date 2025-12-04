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
exports.UpdateFlightsTable20250101000001 = void 0;
const typeorm_1 = require("typeorm");
class UpdateFlightsTable20250101000001 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add currency column
            yield queryRunner.addColumn("flights", new typeorm_1.TableColumn({
                name: "currency",
                type: "varchar",
                length: "10",
                default: "'AED'",
                isNullable: false,
            }));
            // Add departure_iata column
            yield queryRunner.addColumn("flights", new typeorm_1.TableColumn({
                name: "departureiata",
                type: "varchar",
                length: "10",
                isNullable: true,
            }));
            // Add arrival_iata column
            yield queryRunner.addColumn("flights", new typeorm_1.TableColumn({
                name: "arrivaliata",
                type: "varchar",
                length: "10",
                isNullable: true,
            }));
            // Add is_suggested column
            yield queryRunner.addColumn("flights", new typeorm_1.TableColumn({
                name: "isSuggested",
                type: "boolean",
                default: false,
                isNullable: false,
            }));
            // Update flight_duration type to int
            yield queryRunner.query(`
      ALTER TABLE flights 
      MODIFY COLUMN flight_duration INT NOT NULL DEFAULT 0
    `);
            console.log("✅ Successfully updated flights table with new columns");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Revert changes if needed
            yield queryRunner.dropColumn("flights", "currency");
            yield queryRunner.dropColumn("flights", "departure_iata");
            yield queryRunner.dropColumn("flights", "arrival_iata");
            yield queryRunner.dropColumn("flights", "is_suggested");
            // Revert flight_duration back to varchar
            yield queryRunner.query(`
      ALTER TABLE flights 
      MODIFY COLUMN flight_duration VARCHAR(20)
    `);
            console.log("✅ Reverted flights table changes");
        });
    }
}
exports.UpdateFlightsTable20250101000001 = UpdateFlightsTable20250101000001;
