import { Migration } from '@mikro-orm/migrations'

// Adds a custom text column `ingredientes` to the core `product` table
export class Migration20250930120000 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "product" add column "ingredientes" text;')
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop column "ingredientes";')
  }
}
