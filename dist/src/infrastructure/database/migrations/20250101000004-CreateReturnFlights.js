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
exports.CreateReturnFlights20250101000004 = void 0;
class CreateReturnFlights20250101000004 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // First create the table without foreign keys
            yield queryRunner.query(`
      CREATE TABLE IF NOT EXISTS return_flights (
        id CHAR(36) NOT NULL PRIMARY KEY,
        flight_id CHAR(36) NOT NULL,
        status BOOLEAN DEFAULT true,
        airline_id CHAR(36) NULL,
        client_id CHAR(36) NULL,
        name VARCHAR(255) NULL,
        seats JSON NULL,
        rating DECIMAL(4,2) DEFAULT 0 NULL,
        departure_city VARCHAR(100) NOT NULL,
        arrival_city VARCHAR(100) NOT NULL,
        departure_iata VARCHAR(10) NOT NULL,
        arrival_iata VARCHAR(10) NOT NULL,
        departure_time TIMESTAMP NOT NULL,
        arrival_time TIMESTAMP NOT NULL,
        duration INT NOT NULL COMMENT 'Duration in minutes',
        flight_number VARCHAR(20) NULL,
        airline VARCHAR(100) NULL,
        price DECIMAL(10,2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'AED' NOT NULL,
        number_of_stops INT DEFAULT 0,
        available_seats INT DEFAULT 0,
        aircraft_type VARCHAR(100) NULL,
        aircraft_image VARCHAR(255) NULL,
        seat_layout VARCHAR(50) NULL,
        seat_pitch VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
            // Then add the foreign keys
            yield queryRunner.query(`
      ALTER TABLE return_flights
      ADD CONSTRAINT FK_return_flights_flight_id
      FOREIGN KEY (flight_id) REFERENCES flights(id)
      ON DELETE CASCADE;
    `);
            yield queryRunner.query(`
      ALTER TABLE return_flights
      ADD CONSTRAINT FK_return_flights_airline_id
      FOREIGN KEY (airline_id) REFERENCES air_lines(id)
      ON DELETE SET NULL;
    `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Drop foreign keys first
            yield queryRunner.query(`
      ALTER TABLE return_flights
      DROP FOREIGN KEY IF EXISTS FK_return_flights_flight_id;
    `);
            yield queryRunner.query(`
      ALTER TABLE return_flights
      DROP FOREIGN KEY IF EXISTS FK_return_flights_airline_id;
    `);
            // Then drop the table
            yield queryRunner.dropTable("return_flights");
        });
    }
}
exports.CreateReturnFlights20250101000004 = CreateReturnFlights20250101000004;
