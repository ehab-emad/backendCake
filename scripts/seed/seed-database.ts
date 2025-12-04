import "reflect-metadata";
import { AppDataSource } from "../../src/infrastructure/config/database.config";
import { AuthSeeder } from "../../src/infrastructure/database/seeders/AuthSeeder";

async function seedDatabase() {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    console.log("Connecting to database...");
    await AppDataSource.initialize();
    await queryRunner.connect();

    console.log("Seeding auth users...");
    await queryRunner.startTransaction();
    try {
      await new AuthSeeder().run(queryRunner);
      await queryRunner.commitTransaction();
      console.log("Auth users seeded successfully!");
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await queryRunner.release();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seedDatabase();
