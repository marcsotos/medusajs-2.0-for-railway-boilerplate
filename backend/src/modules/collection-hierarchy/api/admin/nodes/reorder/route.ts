import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CollectionHierarchyService from "../../../../services/collection-hierarchy";
import {
  validateReorderSiblingsInput,
  ReorderSiblingsInput,
} from "../../../../types";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  try {
    const validatedInput: ReorderSiblingsInput = validateReorderSiblingsInput(req.body);
    await collectionHierarchyService.reorderSiblings(validatedInput);

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message: "Failed to reorder siblings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};