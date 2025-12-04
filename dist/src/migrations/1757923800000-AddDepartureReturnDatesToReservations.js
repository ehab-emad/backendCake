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
exports.AddDepartureReturnDatesToReservations1757923800000 = void 0;
const typeorm_1 = require("typeorm");
class AddDepartureReturnDatesToReservations1757923800000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumns('reservations', [
                new typeorm_1.TableColumn({
                    name: 'departure_date',
                    type: 'date',
                    isNullable: true,
                }),
                new typeorm_1.TableColumn({
                    name: 'return_date',
                    type: 'date',
                    isNullable: true,
                }),
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn('reservations', 'departure_date');
            yield queryRunner.dropColumn('reservations', 'return_date');
        });
    }
}
exports.AddDepartureReturnDatesToReservations1757923800000 = AddDepartureReturnDatesToReservations1757923800000;
