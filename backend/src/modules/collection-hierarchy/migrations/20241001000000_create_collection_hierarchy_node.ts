import { Migration } from "@mikro-orm/migrations";

export class CreateCollectionHierarchyNode20241001000000 extends Migration {
  async up(): Promise<void> {
    // Create the collection_hierarchy_node table
    this.addSql(`
      CREATE TABLE "collection_hierarchy_node" (
        "id" text NOT NULL,
        "collection_id" text NULL,
        "parent_id" text NULL,
        "name" text NOT NULL,
        "slug" text NOT NULL,
        "path" text NOT NULL DEFAULT '',
        "depth" integer NOT NULL DEFAULT 0,
        "position" integer NOT NULL DEFAULT 0,
        "metadata" jsonb NULL,
        CONSTRAINT "collection_hierarchy_node_pkey" PRIMARY KEY ("id")
      );
    `);

    // Create indexes
    this.addSql(`
      CREATE INDEX "IDX_collection_hierarchy_node_parent_id" ON "collection_hierarchy_node" ("parent_id");
    `);

    this.addSql(`
      CREATE INDEX "IDX_collection_hierarchy_node_path" ON "collection_hierarchy_node" ("path");
    `);

    this.addSql(`
      CREATE INDEX "IDX_collection_hierarchy_node_position" ON "collection_hierarchy_node" ("position");
    `);

    this.addSql(`
      CREATE INDEX "IDX_collection_hierarchy_node_collection_id" ON "collection_hierarchy_node" ("collection_id");
    `);

    // Create unique constraints
    this.addSql(`
      CREATE UNIQUE INDEX "UQ_collection_hierarchy_node_slug" ON "collection_hierarchy_node" ("slug");
    `);

    this.addSql(`
      CREATE UNIQUE INDEX "UQ_collection_hierarchy_node_path" ON "collection_hierarchy_node" ("path");
    `);

    this.addSql(`
      CREATE UNIQUE INDEX "UQ_collection_hierarchy_node_parent_name" ON "collection_hierarchy_node" ("parent_id", "name");
    `);

    // Add foreign key constraint to self (parent_id)
    this.addSql(`
      ALTER TABLE "collection_hierarchy_node" 
      ADD CONSTRAINT "FK_collection_hierarchy_node_parent" 
      FOREIGN KEY ("parent_id") REFERENCES "collection_hierarchy_node" ("id") 
      ON DELETE CASCADE;
    `);

    // Add foreign key constraint to product_collection (optional, if you want to enforce referential integrity)
    // Note: This assumes the product_collection table exists in your Medusa installation
    // If you prefer loose coupling, you can comment this out
    this.addSql(`
      ALTER TABLE "collection_hierarchy_node" 
      ADD CONSTRAINT "FK_collection_hierarchy_node_collection" 
      FOREIGN KEY ("collection_id") REFERENCES "product_collection" ("id") 
      ON DELETE SET NULL;
    `);
  }

  async down(): Promise<void> {
    // Drop foreign key constraints first
    this.addSql(`
      ALTER TABLE "collection_hierarchy_node" 
      DROP CONSTRAINT IF EXISTS "FK_collection_hierarchy_node_collection";
    `);

    this.addSql(`
      ALTER TABLE "collection_hierarchy_node" 
      DROP CONSTRAINT IF EXISTS "FK_collection_hierarchy_node_parent";
    `);

    // Drop the table
    this.addSql('DROP TABLE IF EXISTS "collection_hierarchy_node";');
  }
}