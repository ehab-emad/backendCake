import { AppDataSource } from './data-source';

async function checkMigrations() {
    try {
        await AppDataSource.initialize();
        const queryRunner = AppDataSource.createQueryRunner();
        
        // Check if migrations table exists
        const migrationsTableExists = await queryRunner.hasTable('migrations_history');
        
        if (!migrationsTableExists) {
            console.log('Migrations table does not exist yet.');
            return;
        }
        
        // Get all applied migrations
        const appliedMigrations = await queryRunner.query(
            'SELECT * FROM migrations_history ORDER BY timestamp DESC'
        );
        
        console.log('Applied migrations:');
        console.table(appliedMigrations);
        
        await queryRunner.release();
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error checking migrations:', error);
    }
}

checkMigrations();
