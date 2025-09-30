import { EntityManager } from "@mikro-orm/core";
import { CollectionHierarchyNode } from "../models/collection-hierarchy-node";

export async function seedCollectionHierarchy(manager: EntityManager): Promise<void> {
  const nodeRepo = manager.getRepository(CollectionHierarchyNode);

  // Check if nodes already exist
  const existingNodes = await nodeRepo.findAll();
  if (existingNodes.length > 0) {
    console.log("Collection hierarchy nodes already exist, skipping seed...");
    return;
  }

  console.log("Seeding collection hierarchy nodes...");

  // Create root categories
  const rootCategories = [
    {
      name: "Chuches",
      slug: "chuches",
      collection_id: null,
      parent_id: null,
      position: 0,
      metadata: { description: "Todas las golosinas y dulces", is_public: true },
    },
    {
      name: "Medicamentos",
      slug: "medicamentos",
      collection_id: null,
      parent_id: null,
      position: 1,
      metadata: { description: "Productos farmacéuticos", is_public: true },
    },
    {
      name: "Cuidado Personal",
      slug: "cuidado-personal",
      collection_id: null,
      parent_id: null,
      position: 2,
      metadata: { description: "Productos de higiene y cuidado", is_public: true },
    },
  ];

  const createdRoots = [];
  for (const rootData of rootCategories) {
    const node = nodeRepo.create(rootData);
    await manager.persistAndFlush(node);
    createdRoots.push(node);
    console.log(`Created root node: ${node.name} (${node.id})`);
  }

  // Create subcategories for "Chuches"
  const chuchesRoot = createdRoots[0];
  const chuchesSubcategories = [
    {
      name: "Sin Gluten",
      slug: "sin-gluten",
      collection_id: null, // You can link to actual collections later
      parent_id: chuchesRoot.id,
      position: 0,
      metadata: { description: "Golosinas sin gluten", is_public: true, dietary: "gluten-free" },
    },
    {
      name: "Veganas",
      slug: "veganas",
      collection_id: null,
      parent_id: chuchesRoot.id,
      position: 1,
      metadata: { description: "Golosinas veganas", is_public: true, dietary: "vegan" },
    },
    {
      name: "Chocolates",
      slug: "chocolates",
      collection_id: null,
      parent_id: chuchesRoot.id,
      position: 2,
      metadata: { description: "Chocolates y derivados", is_public: true },
    },
    {
      name: "Gominolas",
      slug: "gominolas",
      collection_id: null,
      parent_id: chuchesRoot.id,
      position: 3,
      metadata: { description: "Gominolas y caramelos blandos", is_public: true },
    },
  ];

  const createdChuches = [];
  for (const subcatData of chuchesSubcategories) {
    const node = nodeRepo.create(subcatData);
    await manager.persistAndFlush(node);
    createdChuches.push(node);
    console.log(`Created subcategory: ${node.name} (${node.id})`);
  }

  // Create subcategories for "Medicamentos"
  const medicamentosRoot = createdRoots[1];
  const medicamentosSubcategories = [
    {
      name: "Analgésicos",
      slug: "analgesicos",
      collection_id: null,
      parent_id: medicamentosRoot.id,
      position: 0,
      metadata: { description: "Medicamentos para el dolor", is_public: true, type: "analgesic" },
    },
    {
      name: "Vitaminas",
      slug: "vitaminas",
      collection_id: null,
      parent_id: medicamentosRoot.id,
      position: 1,
      metadata: { description: "Suplementos vitamínicos", is_public: true, type: "supplement" },
    },
    {
      name: "Digestivos",
      slug: "digestivos",
      collection_id: null,
      parent_id: medicamentosRoot.id,
      position: 2,
      metadata: { description: "Medicamentos para problemas digestivos", is_public: true, type: "digestive" },
    },
  ];

  for (const subcatData of medicamentosSubcategories) {
    const node = nodeRepo.create(subcatData);
    await manager.persistAndFlush(node);
    console.log(`Created subcategory: ${node.name} (${node.id})`);
  }

  // Create sub-subcategories for "Chocolates"
  const chocolatesNode = createdChuches[2];
  const chocolateSubcategories = [
    {
      name: "Chocolate Negro",
      slug: "chocolate-negro",
      collection_id: null,
      parent_id: chocolatesNode.id,
      position: 0,
      metadata: { description: "Chocolate con alto contenido de cacao", is_public: true, cocoa_level: "dark" },
    },
    {
      name: "Chocolate con Leche",
      slug: "chocolate-con-leche",
      collection_id: null,
      parent_id: chocolatesNode.id,
      position: 1,
      metadata: { description: "Chocolate cremoso con leche", is_public: true, cocoa_level: "milk" },
    },
    {
      name: "Chocolate Blanco",
      slug: "chocolate-blanco",
      collection_id: null,
      parent_id: chocolatesNode.id,
      position: 2,
      metadata: { description: "Chocolate blanco dulce", is_public: true, cocoa_level: "white" },
    },
  ];

  for (const subcatData of chocolateSubcategories) {
    const node = nodeRepo.create(subcatData);
    await manager.persistAndFlush(node);
    console.log(`Created sub-subcategory: ${node.name} (${node.id})`);
  }

  console.log("Collection hierarchy seed completed successfully!");
}

// Export for use in main seed script
export default seedCollectionHierarchy;