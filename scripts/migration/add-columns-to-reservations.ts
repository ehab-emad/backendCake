import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../.env') });

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ticket',
  entities: [__dirname + '/../../src/core/entities/*.ts'],
  synchronize: false,
  logging: true,
});

async function runMigration() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    // Add new columns
    await queryRunner.query(`
      ALTER TABLE reservations 
      ADD COLUMN infant INT NOT NULL DEFAULT 0,
      ADD COLUMN rooms INT NOT NULL DEFAULT 1,
      ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;
    `);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

runMigration();
