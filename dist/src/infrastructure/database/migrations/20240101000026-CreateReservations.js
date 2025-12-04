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
exports.CreateReservations20240101000026 = void 0;
const typeorm_1 = require("typeorm");
class CreateReservations20240101000026 {
    up(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.createTable(new typeorm_1.Table({
                name: "reservations",
                engine: "InnoDB",
                columns: [
                    {
                        name: "id",
                        type: "char",
                        length: "36",
                        isPrimary: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "reservation_number",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "20",
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "extras",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "client_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "customer_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    { name: "room_id", type: "char", length: "36", isNullable: true },
                    { name: "flight_id", type: "char", length: "36", isNullable: true },
                    { name: "trip_id", type: "char", length: "36", isNullable: true },
                    { name: "from_date", type: "date", isNullable: true },
                    { name: "to_date", type: "date", isNullable: true },
                    { name: "adult", type: "int", isNullable: true },
                    { name: "children", type: "int", isNullable: true },
                    {
                        name: "seat",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "main_flight_seats",
                        type: "json",
                        isNullable: true,
                    },
                    {
                        name: "seats",
                        type: "json",
                        isNullable: true
                    },
                    {
                        name: "payment_id",
                        type: "char",
                        length: "36",
                        isNullable: true,
                        charset: "utf8mb4",
                        collation: "utf8mb4_unicode_ci",
                    },
                    {
                        name: "transit_flight_seats",
                        type: "json",
                        isNullable: true,
                    },
                    {
                        name: "return_flight_seats",
                        type: "json",
                        isNullable: true,
                    },
                    {
                        name: "baggage",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "extra_baggage",
                        type: "json",
                        isNullable: true,
                    },
                    {
                        name: "meals",
                        type: "json",
                        isNullable: true,
                    },
                    {
                        name: "unlimited_internet",
                        type: "json",
                        isNullable: true,
                    },
                    {
                        name: "airport_transfer",
                        type: "json",
                        isNullable: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "departure_date",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "return_date",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "infant",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "rooms",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "price",
                        type: "decimal",
                        isNullable: true,
                    },
                    {
                        name: "phone_number",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "passport_number",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "passport_expiry",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "nationality",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "gender",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "date_of_birth",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "latitude",
                        type: "decimal",
                        precision: 10,
                        scale: 7,
                        isNullable: true,
                    },
                    {
                        name: "longitude",
                        type: "decimal",
                        precision: 10,
                        scale: 7,
                        isNullable: true,
                    },
                    {
                        name: "payment_status",
                        type: "varchar",
                        length: "20",
                        default: "'pending'"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            const fk = (col, ref) => new typeorm_1.TableForeignKey({
                columnNames: [col],
                referencedTableName: ref,
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            });
            yield q.createForeignKey("reservations", fk("client_id", "clients"));
            yield q.createForeignKey("reservations", fk("customer_id", "customers"));
            yield q.createForeignKey("reservations", fk("room_id", "rooms"));
            yield q.createForeignKey("reservations", fk("flight_id", "flights"));
            yield q.createForeignKey("reservations", fk("trip_id", "trips"));
            yield q.query(`
      CREATE TRIGGER reservation_before_insert
      BEFORE INSERT ON reservations
      FOR EACH ROW
      BEGIN
        IF NEW.room_id IS NOT NULL THEN
          SET @avail := (
            SELECT available_rooms
              FROM rooms
             WHERE id = NEW.room_id
             FOR UPDATE
          );
          IF @avail < 1 THEN
            SIGNAL SQLSTATE '45000'
              SET MESSAGE_TEXT = 'No rooms available for the selected dates';
          END IF;
        END IF;
      END;
    `);
            yield q.query(`
      CREATE TRIGGER reservation_after_insert
      AFTER INSERT ON reservations
      FOR EACH ROW
      BEGIN
        IF NEW.room_id IS NOT NULL THEN
          UPDATE rooms
             SET available_rooms = available_rooms - 1,
                 status = (available_rooms - 1 > 0)
           WHERE id = NEW.room_id;
        END IF;
      END;
    `);
            yield q.query(`
      CREATE TRIGGER reservation_after_delete
      AFTER DELETE ON reservations
      FOR EACH ROW
      BEGIN
        IF OLD.room_id IS NOT NULL THEN
          UPDATE rooms
             SET available_rooms = available_rooms + 1,
                 status = TRUE
           WHERE id = OLD.room_id;
        END IF;
      END;
    `);
            yield q.query(`
      CREATE TRIGGER reservation_after_update
      AFTER UPDATE ON reservations
      FOR EACH ROW
      BEGIN
        IF OLD.room_id IS NOT NULL THEN
          -- releasing on cancelled or completed
          IF NEW.status IN ('cancelled','completed')
             AND OLD.status NOT IN ('cancelled','completed') THEN
            UPDATE rooms
               SET available_rooms = available_rooms + 1,
                   status = TRUE
             WHERE id = OLD.room_id;
          -- re-taking on reinstatement
          ELSEIF OLD.status IN ('cancelled','completed')
             AND NEW.status NOT IN ('cancelled','completed') THEN
            UPDATE rooms
               SET available_rooms = available_rooms - 1,
                   status = (available_rooms - 1 > 0)
             WHERE id = NEW.room_id;
          END IF;
        END IF;
      END;
    `);
        });
    }
    down(q) {
        return __awaiter(this, void 0, void 0, function* () {
            yield q.query(`DROP TRIGGER IF EXISTS reservation_after_update`);
            yield q.query(`DROP TRIGGER IF EXISTS reservation_after_delete`);
            yield q.query(`DROP TRIGGER IF EXISTS reservation_after_insert`);
            yield q.query(`DROP TRIGGER IF EXISTS reservation_before_insert`);
            const table = yield q.getTable("reservations");
            if (table) {
                for (const fk of table.foreignKeys) {
                    yield q.dropForeignKey("reservations", fk);
                }
            }
            yield q.dropTable("reservations");
        });
    }
}
exports.CreateReservations20240101000026 = CreateReservations20240101000026;
