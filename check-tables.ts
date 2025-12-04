import { AppDataSource } from './data-source';

async function listTables() {
    try {
        await AppDataSource.initialize();
        const queryRunner = AppDataSource.createQueryRunner();
        
        // Get all tables in the database
        const tables = await queryRunner.query(
            `SELECT TABLE_NAME 
             FROM information_schema.tables 
             WHERE table_schema = '${process.env.DB_NAME || 'ticket'}'`
        );
        
        console.log('Database tables:');
        console.table(tables);
        
        await queryRunner.release();
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error listing tables:', error);
    }
}

listTables();
