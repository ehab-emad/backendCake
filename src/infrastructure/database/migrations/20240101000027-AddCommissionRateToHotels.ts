import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCommissionRateToHotels20240101000027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('hotels');
    
    if (table) {
      // Check if commission_rate column doesn't exist
      const commissionRateColumn = table.columns.find(column => column.name === 'commission_rate');
      
      if (!commissionRateColumn) {
        // Add the new commission_rate column
        await queryRunner.addColumn('hotels', new TableColumn({
          name: 'commission_rate',
          type: 'decimal',
          precision: 5,
          scale: 2,
          default: 0.0,
          isNullable: false,
          comment: 'Commission rate for the hotel'
        }));
        
        console.log('Added commission_rate column to hotels table');
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Safe down migration - don't drop the column to prevent data loss
    console.log('No destructive operations performed in down migration');
  }
}
