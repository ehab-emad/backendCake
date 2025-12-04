import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNewCustomerFields1753360206348 implements MigrationInterface {
    private async columnExists(queryRunner: QueryRunner, tableName: string, columnName: string): Promise<boolean> {
        const table = await queryRunner.getTable(tableName);
        return table?.columns.some(column => column.name === columnName) || false;
    }
    public async up(queryRunner: QueryRunner): Promise<void> {
        // List of columns to add with their configurations
        const columnsToAdd = [
            {
                name: 'customer_type',
                type: 'enum',
                enum: ['VIP', 'Regular'],
                default: '\'Regular\'',
                isNullable: false
            },
            { name: "status", type: "boolean", default: true },
            { name: 'nationality', type: 'varchar', length: '50', isNullable: true },
            { name: 'name', type: 'varchar', length: '255', isNullable: true },
            { name: 'email', type: 'varchar', length: '255', isNullable: true },
            { name: 'gender', type: 'varchar', length: '20', isNullable: true },
            { name: 'latitude', type: 'decimal', precision: 10, scale: 7, isNullable: true },
            { name: 'longitude', type: 'decimal', precision: 10, scale: 7, isNullable: true },
            { name: 'date_of_birth', type: 'date', isNullable: true },
            { name: 'passport_expiry', type: 'date', isNullable: true },
            { name: 'phone_number', type: 'varchar', length: '20', isNullable: true },
            { name: 'first_name', type: 'varchar', length: '100', isNullable: true },
            { name: 'last_name', type: 'varchar', length: '100', isNullable: true },
            { name: 'locale', type: 'varchar', length: '10', isNullable: true },
            {name:"latitude",type:"decimal",precision:10,scale:7,isNullable:true},
            {name:"longitude",type:"decimal",precision:10,scale:7,isNullable:true},

            

            { name: 'profile_picture', type: 'varchar', length: '255', isNullable: true },
        
            { name: 'passport_number', type: 'varchar', length: '50', isNullable: true },
            { name: 'address_line1', type: 'varchar', length: '255', isNullable: true },
            { name: 'address_line2', type: 'varchar', length: '255', isNullable: true },
            { name: 'city', type: 'varchar', length: '100', isNullable: true },
            { name: 'country', type: 'varchar', length: '100', isNullable: true },
            { name: 'registration_date', type: 'date', isNullable: true },
            { name: 'expiration_date', type: 'date', isNullable: true },
            { name: 'customername', type: 'varchar', length: '100', isNullable: true },
            { name: 'email', type: 'varchar', length: '150', isNullable: true },
        ];

        // Add each column if it doesn't exist
        for (const column of columnsToAdd) {
            const columnExists = await this.columnExists(queryRunner, 'customers', column.name);
            if (!columnExists) {
                const tableColumn = new TableColumn({
                    name: column.name,
                    type: column.type,
                    isNullable: column.isNullable,
                    default: (column as any).default
                });
                
                // Handle enum type specifically
                if (column.type === 'enum' && (column as any).enum) {
                    (tableColumn as any).enum = (column as any).enum;
                }
                
                // Handle length for varchar
                if (column.type === 'varchar' && column.length) {
                    tableColumn.length = column.length;
                }
                
                await queryRunner.addColumn('customers', tableColumn);
                console.log(`Added column: ${column.name}`);
            } else {
                console.log(`Column ${column.name} already exists, skipping...`);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // List of columns that might have been added (in reverse order for proper rollback)
        const columnsToDrop = [
           
            'email',
            'status',
            'customername',
            'expiration_date',
            'registration_date',
            'first_name',
            'last_name',
            'locale',
            'profile_picture',
            'latitude',
            'longitude',
            'gender',
            'phone_number',
            'name',

            'date_of_birth',
            'passport_expiry',
            'passport_number',
            'nationality',
            'customer_type'
        ];

        // Drop each column if it exists
        for (const columnName of columnsToDrop) {
            const columnExists = await this.columnExists(queryRunner, 'customers', columnName);
            if (columnExists) {
                await queryRunner.dropColumn('customers', columnName);
                console.log(`Dropped column: ${columnName}`);
            } else {
                console.log(`Column ${columnName} doesn't exist, skipping...`);
            }
        }
    }
}
