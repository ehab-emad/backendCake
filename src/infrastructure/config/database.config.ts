import { DataSource } from "typeorm";
import path from "path";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../../../.env") });

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "travel_booking",

  synchronize: false,

  logging: true,
  

  entities: [
    path.resolve(__dirname, "../../infrastructure/database/models/*.{js,ts}"),
  ],

  migrations: [
    path.resolve(
      __dirname,
      "../../infrastructure/database/migrations/*.{js,ts}"
    ),
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

  timezone: "Z",
});

AppDataSource.initialize()
  .then(() => {
    console.log(
      "Loaded entities:",
      AppDataSource.entityMetadatas.map((e) => e.name)
    );
  })
  .catch((err) => {
    console.error("DataSource initialization failed:", err);
  });

export default AppDataSource;