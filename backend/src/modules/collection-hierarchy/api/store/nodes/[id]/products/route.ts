import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CollectionHierarchyService from "../../../../../services/collection-hierarchy";
import { validateGetProductsInput } from "../../../../../types";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  const { id } = req.params;

  try {
    const validatedInput = validateGetProductsInput(req.query);
    const result = await collectionHierarchyService.listProductsUnderNode(id, validatedInput);

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: "Failed to retrieve products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};