import { MedusaService } from "@medusajs/framework/utils";
import { EntityManager } from "@mikro-orm/core";
import { CollectionHierarchyNode } from "../models/collection-hierarchy-node";
import {
  CreateNodeInput,
  UpdateNodeInput,
  MoveNodeInput,
  ReorderSiblingsInput,
  NodeResponse,
  TreeNodeResponse,
  BreadcrumbResponse,
} from "../types";
import { generateUniqueSlug } from "../utils/slug";

interface CollectionHierarchyServiceProps {
  manager: EntityManager;
}

export default class CollectionHierarchyService extends MedusaService(
  {
    CollectionHierarchyNode,
  }
) {
  protected manager_: EntityManager;

  constructor({ manager }: CollectionHierarchyServiceProps) {
    // @ts-ignore
    super(...arguments);
    
    this.manager_ = manager;
  }

  /**
   * Create a new hierarchy node
   */
  async createNode(input: CreateNodeInput): Promise<NodeResponse> {
    return await this.manager_.transactional(async (em) => {
      const nodeRepo = em.getRepository(CollectionHierarchyNode);
      
      // Generate unique slug if not provided
      let slug = input.slug;
      if (!slug) {
        slug = await generateUniqueSlug(input.name, async (s) => {
          const existing = await nodeRepo.findOne({ slug: s });
          return !!existing;
        });
      } else {
        // Check if slug already exists
        const existing = await nodeRepo.findOne({ slug });
        if (existing) {
          throw new Error(`Node with slug "${slug}" already exists`);
        }
      }

      // Validate parent exists if provided
      if (input.parent_id) {
        const parent = await nodeRepo.findOne({ id: input.parent_id });
        if (!parent) {
          throw new Error(`Parent node with id "${input.parent_id}" not found`);
        }
      }

      // Set position if not provided
      let position = input.position;
      if (position === undefined) {
        const siblings = await nodeRepo.find({
          parent_id: input.parent_id || null
        });
        position = siblings.length;
      }

      const node = nodeRepo.create({
        name: input.name,
        slug,
        collection_id: input.collection_id || null,
        parent_id: input.parent_id || null,
        position,
        metadata: input.metadata || null,
      });

      await em.persistAndFlush(node);
      
      return this.formatNodeResponse(node);
    });
  }

  /**
   * Update an existing hierarchy node
   */
  async updateNode(id: string, input: UpdateNodeInput): Promise<NodeResponse> {
    return await this.manager_.transactional(async (em) => {
      const nodeRepo = em.getRepository(CollectionHierarchyNode);
      
      const node = await nodeRepo.findOne({ id });
      if (!node) {
        throw new Error(`Node with id "${id}" not found`);
      }

      // Update fields
      if (input.name !== undefined) {
        node.name = input.name;
      }

      if (input.slug !== undefined) {
        // Check if new slug already exists (excluding current node)
        const existing = await nodeRepo.findOne({ 
          slug: input.slug,
          id: { $ne: id }
        });
        if (existing) {
          throw new Error(`Node with slug "${input.slug}" already exists`);
        }
        node.slug = input.slug;
      }

      if (input.collection_id !== undefined) {
        node.collection_id = input.collection_id;
      }

      if (input.metadata !== undefined) {
        node.metadata = input.metadata;
      }

      await em.persistAndFlush(node);
      
      return this.formatNodeResponse(node);
    });
  }

  /**
   * Delete a hierarchy node (soft delete)
   */
  async deleteNode(id: string, cascade: boolean = false): Promise<void> {
    return await this.manager_.transactional(async (em) => {
      const nodeRepo = em.getRepository(CollectionHierarchyNode);
      
      const node = await nodeRepo.findOne({ id });
      if (!node) {
        throw new Error(`Node with id "${id}" not found`);
      }

      const children = await nodeRepo.find({
        parent_id: id
      });
      
      if (children.length > 0 && !cascade) {
        throw new Error(`Cannot delete node with children. Use cascade=true to delete children as well`);
      }

      if (cascade) {
        // Delete all descendants
        const descendants = await nodeRepo.find({
          path: { $like: `${node.path}/%` }
        });
        for (const descendant of descendants) {
          await em.removeAndFlush(descendant);
        }
      }

      await em.removeAndFlush(node);
    });
  }

  /**
   * Move a node to a new parent and/or position
   */
  async moveNode(id: string, input: MoveNodeInput): Promise<NodeResponse> {
    return await this.manager_.transactional(async (em) => {
      const nodeRepo = em.getRepository(CollectionHierarchyNode);
      
      const node = await nodeRepo.findOne({ id });
      if (!node) {
        throw new Error(`Node with id "${id}" not found`);
      }

      // Validate new parent exists
      if (input.new_parent_id) {
        const newParent = await nodeRepo.findOne({ id: input.new_parent_id });
        if (!newParent) {
          throw new Error(`Parent node with id "${input.new_parent_id}" not found`);
        }

        // Check for cycles - simple check: can't move to self or descendant
        if (id === input.new_parent_id) {
          throw new Error(`Moving node would create a cycle`);
        }
        
        // Check if new parent is a descendant of this node
        const descendants = await nodeRepo.find({
          path: { $like: `${node.path}/%` }
        });
        
        if (descendants.some(d => d.id === input.new_parent_id)) {
          throw new Error(`Moving node would create a cycle`);
        }
      }

      // Set new position if not provided
      let newPosition = input.new_position;
      if (newPosition === undefined) {
        const siblings = await nodeRepo.find({
          parent_id: input.new_parent_id || null
        });
        newPosition = siblings.length;
      }

      // Update node
      node.parent_id = input.new_parent_id;
      node.position = newPosition;

      // The path and depth will be recalculated by the beforeSave hook
      await em.persistAndFlush(node);

      // Update paths and depths for all descendants
      await this.updateDescendantPaths(em, node);
      
      return this.formatNodeResponse(node);
    });
  }

  /**
   * Reorder siblings
   */
  async reorderSiblings(input: ReorderSiblingsInput): Promise<void> {
    await this.manager_.transactional(async (em) => {
      for (let i = 0; i < input.ordered_ids.length; i++) {
        const node = await em.findOne(CollectionHierarchyNode, { id: input.ordered_ids[i] });
        if (node && node.parent_id === (input.parent_id || null)) {
          node.position = i;
          em.persist(node);
        }
      }
    });
  }

  /**
   * Get tree structure
   */
  async getTree(rootId?: string): Promise<TreeNodeResponse[]> {
    const nodeRepo = this.manager_.getRepository(CollectionHierarchyNode);
    let nodes: CollectionHierarchyNode[];
    
    if (rootId) {
      const rootNode = await nodeRepo.findOne({ id: rootId });
      if (!rootNode) {
        return [];
      }
      
      nodes = await nodeRepo.find({
        $or: [
          { id: rootId },
          { path: { $like: `${rootNode.path}/%` } }
        ]
      }, {
        orderBy: { depth: 'asc', position: 'asc' }
      });
    } else {
      nodes = await nodeRepo.findAll({
        orderBy: { depth: 'asc', position: 'asc' }
      });
    }
    
    return this.buildTree(nodes);
  }

  /**
   * Get breadcrumbs for a node
   */
  async getBreadcrumbs(id: string): Promise<BreadcrumbResponse[]> {
    const nodeRepo = this.manager_.getRepository(CollectionHierarchyNode);
    const node = await nodeRepo.findOne({ id });
    if (!node) {
      throw new Error(`Node with id "${id}" not found`);
    }

    // Get ancestors using path-based query
    const pathParts = node.path.split('/');
    const ancestorPaths: string[] = [];
    
    for (let i = 1; i < pathParts.length; i++) {
      ancestorPaths.push(pathParts.slice(0, i).join('/'));
    }

    let ancestors: CollectionHierarchyNode[] = [];
    if (ancestorPaths.length > 0) {
      ancestors = await nodeRepo.find({
        path: { $in: ancestorPaths }
      }, {
        orderBy: { depth: 'asc' }
      });
    }

    const breadcrumbs = ancestors.map(ancestor => ({
      id: ancestor.id,
      name: ancestor.name,
      slug: ancestor.slug,
      path: ancestor.path,
    }));

    // Add the current node
    breadcrumbs.push({
      id: node.id,
      name: node.name,
      slug: node.slug,
      path: node.path,
    });

    return breadcrumbs;
  }

  /**
   * Get descendant nodes
   */
  async listDescendantNodes(id: string): Promise<NodeResponse[]> {
    const nodeRepo = this.manager_.getRepository(CollectionHierarchyNode);
    const node = await nodeRepo.findOne({ id });
    if (!node) {
      return [];
    }

    const descendants = await nodeRepo.find({
      path: { $like: `${node.path}/%` }
    }, {
      orderBy: { depth: 'asc', position: 'asc' }
    });
    
    return descendants.map(node => this.formatNodeResponse(node));
  }

  /**
   * Get descendant collection IDs
   */
  async listDescendantCollectionIds(id: string): Promise<string[]> {
    const nodeRepo = this.manager_.getRepository(CollectionHierarchyNode);
    const node = await nodeRepo.findOne({ id });
    if (!node) {
      return [];
    }

    const descendants = await nodeRepo.find({
      $or: [
        { id: id },
        { path: { $like: `${node.path}/%` } }
      ],
      collection_id: { $ne: null }
    });

    return descendants
      .filter(n => n.collection_id)
      .map(n => n.collection_id as string);
  }

  /**
   * Get products under a node (including descendants)
   * This method should integrate with Medusa's product service
   */
  async listProductsUnderNode(
    id: string,
    options: {
      limit?: number;
      offset?: number;
      region_id?: string;
      currency_code?: string;
      cart_id?: string;
    } = {}
  ): Promise<any> {
    const collectionIds = await this.listDescendantCollectionIds(id);
    
    if (collectionIds.length === 0) {
      return {
        products: [],
        count: 0,
        limit: options.limit || 20,
        offset: options.offset || 0,
      };
    }

    // This would integrate with Medusa's product service
    // For now, return a placeholder structure
    return {
      products: [],
      count: 0,
      limit: options.limit || 20,
      offset: options.offset || 0,
      collection_ids: collectionIds,
    };
  }

  /**
   * Get a single node by ID
   */
  async getNode(id: string): Promise<NodeResponse> {
    const nodeRepo = this.manager_.getRepository(CollectionHierarchyNode);
    const node = await nodeRepo.findOne({ id });
    if (!node) {
      throw new Error(`Node with id "${id}" not found`);
    }
    return this.formatNodeResponse(node);
  }

  /**
   * List nodes with pagination
   */
  async listNodes(options: {
    limit?: number;
    offset?: number;
    parent_id?: string | null;
  } = {}): Promise<{ nodes: NodeResponse[]; count: number }> {
    const { limit = 20, offset = 0, parent_id } = options;
    const nodeRepo = this.manager_.getRepository(CollectionHierarchyNode);
    
    const where: any = {};
    if (parent_id !== undefined) {
      where.parent_id = parent_id;
    }

    const [nodes, count] = await nodeRepo.findAndCount(where, {
      limit,
      offset,
      orderBy: { position: 'asc' },
    });

    return {
      nodes: nodes.map(node => this.formatNodeResponse(node)),
      count,
    };
  }

  // Private helper methods

  private formatNodeResponse(node: CollectionHierarchyNode): NodeResponse {
    return {
      id: node.id,
      collection_id: node.collection_id,
      parent_id: node.parent_id,
      name: node.name,
      slug: node.slug,
      path: node.path,
      depth: node.depth,
      position: node.position,
      metadata: node.metadata,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
  }

  private buildTree(nodes: CollectionHierarchyNode[]): TreeNodeResponse[] {
    const nodeMap = new Map<string, TreeNodeResponse>();
    const rootNodes: TreeNodeResponse[] = [];

    // First pass: create all nodes
    nodes.forEach(node => {
      const treeNode: TreeNodeResponse = {
        ...this.formatNodeResponse(node),
        children: [],
      };
      nodeMap.set(node.id, treeNode);
    });

    // Second pass: build parent-child relationships
    nodes.forEach(node => {
      const treeNode = nodeMap.get(node.id)!;
      if (node.parent_id) {
        const parent = nodeMap.get(node.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(treeNode);
        }
      } else {
        rootNodes.push(treeNode);
      }
    });

    // Sort children by position
    nodeMap.forEach(node => {
      if (node.children) {
        node.children.sort((a, b) => a.position - b.position);
      }
    });

    return rootNodes.sort((a, b) => a.position - b.position);
  }

  private async updateDescendantPaths(em: EntityManager, parentNode: CollectionHierarchyNode): Promise<void> {
    const nodeRepo = em.getRepository(CollectionHierarchyNode);
    const descendants = await nodeRepo.find({
      path: { $like: `${parentNode.path}/%` }
    });

    for (const descendant of descendants) {
      // Recalculate path and depth based on new parent structure
      const pathParts = descendant.path.split('/');
      const ancestorPaths: string[] = [];
      
      for (let i = 1; i < pathParts.length; i++) {
        ancestorPaths.push(pathParts.slice(0, i).join('/'));
      }
      
      let ancestors: CollectionHierarchyNode[] = [];
      if (ancestorPaths.length > 0) {
        ancestors = await nodeRepo.find({
          path: { $in: ancestorPaths }
        }, {
          orderBy: { depth: 'asc' }
        });
      }
      
      const newPathParts = [...ancestors.map(a => a.slug), descendant.slug];
      descendant.path = newPathParts.join('/');
      descendant.depth = ancestors.length;
      em.persist(descendant);
    }

    await em.flush();
  }
}