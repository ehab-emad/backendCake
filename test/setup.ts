import { DataSource, createConnection } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

export async function createTestDataSource(): Promise<DataSource> {
  return createConnection({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_TEST_NAME || 'test_ticket',
    entities: ['src/infrastructure/database/models/**/*.ts'],
    synchronize: true,
    dropSchema: true, // Be careful with this in production!
    logging: false
  });
}

// Mock JWT verification for testing
export const mockJwtAuth = (req: any, res: any, next: any) => {
  // In a real test environment, you'd verify the token properly
  // For testing, we'll just check for a valid token format
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.user = { id: 'test-user-id' }; // Mock user object
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
