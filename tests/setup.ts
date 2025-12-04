import { TestDataSource } from '../src/infrastructure/config/test-database.config';
import { container } from '../src/shared/di/container';

export default async function setup() {
  // Initialize the test database connection
  await TestDataSource.initialize();
  
  // You can add any global test setup code here
  console.log('Global test setup complete');
}
