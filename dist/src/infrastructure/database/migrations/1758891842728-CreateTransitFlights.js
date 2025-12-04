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
exports.CreateTransitFlights1758891842728 = void 0;
class CreateTransitFlights1758891842728 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            CREATE TABLE IF NOT EXISTS transit_flights (
                id CHAR(36) PRIMARY KEY,
                flight_id CHAR(36) NOT NULL,
                status BOOLEAN NOT NULL DEFAULT true,
                airline_id CHAR(36),
                client_id CHAR(36),
                name VARCHAR(255),
                rating DECIMAL(4,2) DEFAULT 0,
                departure_city VARCHAR(100) NOT NULL,
                arrival_city VARCHAR(100) NOT NULL,
                departure_iata VARCHAR(10) NOT NULL,
                arrival_iata VARCHAR(10) NOT NULL,
                departure_time TIMESTAMP NOT NULL,
                arrival_time TIMESTAMP NOT NULL,
                duration INT NOT NULL,
                flight_number VARCHAR(20),
                airline VARCHAR(100),
                price DECIMAL(10,2) DEFAULT 0,
                currency VARCHAR(10) DEFAULT 'AED',
                number_of_stops INT DEFAULT 0,
                available_seats INT DEFAULT 0,
                aircraft_type VARCHAR(100),
                aircraft_image VARCHAR(255),
                seat_layout VARCHAR(50),
                seat_pitch VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
                FOREIGN KEY (airline_id) REFERENCES air_lines(id) ON DELETE SET NULL
            ) ENGINE=InnoDB;
        `);
            // Add index for better query performance
            yield queryRunner.query(`CREATE INDEX idx_transit_flights_flight_id ON transit_flights(flight_id)`);
            yield queryRunner.query(`CREATE INDEX idx_transit_flights_airline_id ON transit_flights(airline_id)`);
            yield queryRunner.query(`CREATE INDEX idx_transit_flights_departure_arrival ON transit_flights(departure_city, arrival_city)`);
            yield queryRunner.query(`CREATE INDEX idx_transit_flights_departure_time ON transit_flights(departure_time)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Drop indexes first
            yield queryRunner.query(`DROP INDEX idx_transit_flights_departure_time ON transit_flights`);
            yield queryRunner.query(`DROP INDEX idx_transit_flights_departure_arrival ON transit_flights`);
            yield queryRunner.query(`DROP INDEX idx_transit_flights_airline_id ON transit_flights`);
            yield queryRunner.query(`DROP INDEX idx_transit_flights_flight_id ON transit_flights`);
            // Then drop the table
            yield queryRunner.query(`DROP TABLE IF EXISTS transit_flights`);
        });
    }
}
exports.CreateTransitFlights1758891842728 = CreateTransitFlights1758891842728;
