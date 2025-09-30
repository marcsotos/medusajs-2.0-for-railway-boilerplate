import { Module } from "@medusajs/framework/utils";
import CollectionHierarchyService from "./services/collection-hierarchy";

export const COLLECTION_HIERARCHY_MODULE = "collectionHierarchy";

export default Module(COLLECTION_HIERARCHY_MODULE, {
  service: CollectionHierarchyService,
});

// Re-export types and utilities for external use
export * from "./models/collection-hierarchy-node";
export * from "./types";
export * from "./utils/slug";
export { default as CollectionHierarchyService } from "./services/collection-hierarchy";