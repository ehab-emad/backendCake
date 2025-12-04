import { AppDataSource } from './data-source';

async function fixMigration() {
    try {
        await AppDataSource.initialize();
        const queryRunner = AppDataSource.createQueryRunner();
        
        // Mark the failed migration as completed
        await queryRunner.query(`
            INSERT IGNORE INTO migrations_history(timestamp, name) 
            VALUES (1700000000000, 'AddCustomerContactInfo1700000000000')
        `);
        
        console.log('Migration marked as completed successfully!');
        
        await queryRunner.release();
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error fixing migration:', error);
    }
}

fixMigration();
