import { QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class AuthSeeder {
  public async run(queryRunner: QueryRunner): Promise<void> {
    const password_hash = await bcrypt.hash("password123", 10);

    await queryRunner.query(`
      INSERT INTO auth_users (
        id, first_name, last_name, email, phone_number, password_hash, provider, created_at, updated_at
      ) VALUES 
        ('e4a1f2b3-9c8d-4e7f-a123-4567890abcde', 'admin', 'admin', 'admin@example.com', '2465665', '${password_hash}', 'local', NOW(), NOW())
    `);
  }
}
