import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CollectionHierarchyService from "../../../../services/collection-hierarchy";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  const { root_id } = req.query;

  try {
    const tree = await collectionHierarchyService.getTree(root_id as string);
    
    // Filter tree for public visibility (basic implementation)
    const publicTree = tree.filter(node => {
      // You can add metadata.is_public logic here
      return true; // For now, return all nodes
    });

    res.json({ tree: publicTree });
  } catch (error) {
    res.status(400).json({
      message: "Failed to retrieve tree",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};