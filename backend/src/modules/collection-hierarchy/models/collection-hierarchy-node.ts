import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  EventArgs,
  Index,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { BaseEntity } from "@medusajs/framework/utils";
import { generateEntityId } from "@medusajs/framework/utils";

@Entity({ tableName: "collection_hierarchy_node" })
@Index({ properties: ["parent_id"] })
@Index({ properties: ["path"] })
@Index({ properties: ["position"] })
@Unique({ properties: ["parent_id", "name"] })
@Unique({ properties: ["slug"] })
@Unique({ properties: ["path"] })
export class CollectionHierarchyNode extends BaseEntity {
  [OptionalProps]?: "depth" | "position" | "path";

  @PrimaryKey({ columnType: "text" })
  id: string;

  @Property({ columnType: "text", nullable: true })
  @Index()
  collection_id?: string | null;

  @Property({ columnType: "text", nullable: true })
  @Index()
  parent_id?: string | null;

  @ManyToOne(() => CollectionHierarchyNode, {
    nullable: true,
    deleteRule: "cascade",
  })
  parent?: CollectionHierarchyNode | null;

  @OneToMany(() => CollectionHierarchyNode, (node) => node.parent)
  children = new Collection<CollectionHierarchyNode>(this);

  @Property({ columnType: "text" })
  name: string;

  @Property({ columnType: "text", unique: true })
  slug: string;

  @Property({ columnType: "text", unique: true })
  path: string = "";

  @Property({ columnType: "integer", default: 0 })
  depth: number = 0;

  @Property({ columnType: "integer", default: 0 })
  position: number = 0;

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any> | null;

  @OnInit()
  onInit() {
    this.id = this.id || generateEntityId(this.id, "chn");
  }

  @BeforeCreate()
  @BeforeUpdate()
  async beforeSave(args: EventArgs<CollectionHierarchyNode>) {
    const em = args.em;
    
    // Generate slug if not provided
    if (!this.slug && this.name) {
      this.slug = this.generateSlug(this.name);
    }

    // Calculate depth and path
    if (this.parent_id) {
      const parent = await em.findOne(CollectionHierarchyNode, { id: this.parent_id });
      if (parent) {
        this.depth = parent.depth + 1;
        this.path = parent.path ? `${parent.path}/${this.slug}` : this.slug;
      }
    } else {
      this.depth = 0;
      this.path = this.slug;
    }

    // Set position if not provided
    if (this.position === undefined || this.position === null) {
      const siblings = await em.find(CollectionHierarchyNode, {
        parent_id: this.parent_id || null,
        id: { $ne: this.id },
      });
      this.position = siblings.length;
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Helper methods
  isRoot(): boolean {
    return !this.parent_id;
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }

  hasCollection(): boolean {
    return !!this.collection_id;
  }
}