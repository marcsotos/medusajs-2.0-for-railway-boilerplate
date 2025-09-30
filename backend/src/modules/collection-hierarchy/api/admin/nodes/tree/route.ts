import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CollectionHierarchyService from "../../../../services/collection-hierarchy";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  const { root_id } = req.query;

  try {
    const tree = await collectionHierarchyService.getTree(root_id as string);
    res.json({ tree });
  } catch (error) {
    res.status(400).json({
      message: "Failed to retrieve tree",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};