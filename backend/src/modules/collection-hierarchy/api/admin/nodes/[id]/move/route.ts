import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CollectionHierarchyService from "../../../../../services/collection-hierarchy";
import {
  validateMoveNodeInput,
  MoveNodeInput,
} from "../../../../../types";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  const { id } = req.params;

  try {
    const validatedInput: MoveNodeInput = validateMoveNodeInput(req.body);
    const node = await collectionHierarchyService.moveNode(id, validatedInput);

    res.json({ node });
  } catch (error) {
    res.status(400).json({
      message: "Failed to move node",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};