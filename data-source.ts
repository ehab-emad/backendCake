import { DataSource } from "typeorm";
import path from "path";
import { config } from "dotenv";

// Load environment variables
config({ path: path.resolve(__dirname, ".env") });

// Create and export the DataSource
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Ff5192aa",
    database: process.env.DB_NAME || "ticket",
    // synchronize: false,
    logging: false,
    entities: [
        path.resolve(__dirname, "src/infrastructure/database/models/AirLine.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/AirLineFeature.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/AirLineImage.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/AirLineMeal.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Auth.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Client.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/ClientAttachment.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Customer.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/DeviceToken.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Employee.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/EmployeeImage.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Flight.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/FlightRating.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/FlightAmenities.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/FlightBaggage.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/FlightMeals.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Hotel.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/HotelAmenity.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/HotelImage.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Otp.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Payment.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Reservation.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Room.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/RoomAmenity.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/RoomImage.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Ticket.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/TicketAttachment.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/TicketMessage.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/Trip.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/TripFlight.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/TripHotel.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/TripImage.model.ts"),
        path.resolve(__dirname, "src/infrastructure/database/models/TripSchedule.model.ts")
    ],
    migrations: [
        path.resolve(__dirname, "src/infrastructure/database/migrations/*.ts")
    ],
    migrationsTableName: "migrations_history",
    extra: {
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
    },
    connectorPackage: "mysql2",
    supportBigNumbers: true,
    bigNumberStrings: false,
    timezone: "Z"
});
