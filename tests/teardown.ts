import { TestDataSource } from '../src/infrastructure/config/test-database.config';

export default async function teardown() {
  // Close the test database connection
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
  
  // You can add any global test teardown code here
  console.log('Global test teardown complete');
}
