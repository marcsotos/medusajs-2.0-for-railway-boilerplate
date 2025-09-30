import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CollectionHierarchyService from "../../../../services/collection-hierarchy";
import {
  validateUpdateNodeInput,
  UpdateNodeInput,
} from "../../../../types";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  const { id } = req.params;

  try {
    const node = await collectionHierarchyService.getNode(id);
    res.json({ node });
  } catch (error) {
    res.status(404).json({
      message: "Node not found",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  const { id } = req.params;

  try {
    const validatedInput: UpdateNodeInput = validateUpdateNodeInput(req.body);
    const node = await collectionHierarchyService.updateNode(id, validatedInput);

    res.json({ node });
  } catch (error) {
    res.status(400).json({
      message: "Invalid input or node not found",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  const { id } = req.params;
  const { cascade } = req.query;

  try {
    await collectionHierarchyService.deleteNode(id, cascade === "true");
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete node",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};