import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CollectionHierarchyService from "../../../../../services/collection-hierarchy";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  const { id } = req.params;

  try {
    const breadcrumbs = await collectionHierarchyService.getBreadcrumbs(id);
    res.json({ breadcrumbs });
  } catch (error) {
    res.status(404).json({
      message: "Node not found",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};