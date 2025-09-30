import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CollectionHierarchyService from "../../../services/collection-hierarchy";
import {
  validateCreateNodeInput,
  validateUpdateNodeInput,
  CreateNodeInput,
  UpdateNodeInput,
} from "../../../types";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  const { limit, offset, parent_id } = req.query;

  const { nodes, count } = await collectionHierarchyService.listNodes({
    limit: limit ? parseInt(limit as string) : undefined,
    offset: offset ? parseInt(offset as string) : undefined,
    parent_id: parent_id as string,
  });

  res.json({
    nodes,
    count,
    limit: limit ? parseInt(limit as string) : 20,
    offset: offset ? parseInt(offset as string) : 0,
  });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const collectionHierarchyService: CollectionHierarchyService = req.scope.resolve(
    "collectionHierarchyService"
  );

  try {
    const validatedInput: CreateNodeInput = validateCreateNodeInput(req.body);
    const node = await collectionHierarchyService.createNode(validatedInput);

    res.status(201).json({ node });
  } catch (error) {
    res.status(400).json({
      message: "Invalid input",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};