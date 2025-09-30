import { EntitySchema } from "@mikro-orm/core";
import { CollectionHierarchyNode } from "./models/collection-hierarchy-node";

export function registerCollectionHierarchyModule() {
  return {
    models: [CollectionHierarchyNode],
    migrations: {
      path: "./src/modules/collection-hierarchy/migrations",
      glob: "!(*.d).{js,ts}",
    },
  };
}