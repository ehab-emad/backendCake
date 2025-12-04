import { DataSource } from "typeorm";
import path from "path";

export const TestDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  dropSchema: true,
  entities: [
    path.resolve(__dirname, "../../core/entities/*.{js,ts}"),
  ],
  synchronize: true,
  logging: false,
});
