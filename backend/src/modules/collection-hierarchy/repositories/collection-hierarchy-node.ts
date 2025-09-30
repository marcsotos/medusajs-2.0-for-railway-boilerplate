import { EntityRepository } from "@mikro-orm/core";
import { CollectionHierarchyNode } from "../models/collection-hierarchy-node";

export class CollectionHierarchyNodeRepository extends EntityRepository<CollectionHierarchyNode> {
  
  /**
   * Find descendants of a node using path-based query for better performance
   */
  async findDescendants(nodeId: string): Promise<CollectionHierarchyNode[]> {
    const node = await this.findOne({ id: nodeId });
    if (!node) {
      return [];
    }

    return this.find({
      path: { $like: `${node.path}/%` }
    }, {
      orderBy: { depth: 'asc', position: 'asc' }
    });
  }

  /**
   * Find ancestors of a node using path-based query
   */
  async findAncestors(nodeId: string): Promise<CollectionHierarchyNode[]> {
    const node = await this.findOne({ id: nodeId });
    if (!node) {
      return [];
    }

    const pathParts = node.path.split('/');
    const ancestorPaths: string[] = [];
    
    for (let i = 1; i < pathParts.length; i++) {
      ancestorPaths.push(pathParts.slice(0, i).join('/'));
    }

    if (ancestorPaths.length === 0) {
      return [];
    }

    return this.find({
      path: { $in: ancestorPaths }
    }, {
      orderBy: { depth: 'asc' }
    });
  }

  /**
   * Find siblings of a node
   */
  async findSiblings(nodeId: string): Promise<CollectionHierarchyNode[]> {
    const node = await this.findOne({ id: nodeId });
    if (!node) {
      return [];
    }

    return this.find({
      parent_id: node.parent_id || null,
      id: { $ne: nodeId }
    }, {
      orderBy: { position: 'asc' }
    });
  }

  /**
   * Find children of a node
   */
  async findChildren(nodeId: string | null): Promise<CollectionHierarchyNode[]> {
    return this.find({
      parent_id: nodeId || null
    }, {
      orderBy: { position: 'asc' }
    });
  }

  /**
   * Get tree structure starting from a root node
   */
  async getTreeFrom(rootId?: string): Promise<CollectionHierarchyNode[]> {
    if (rootId) {
      const rootNode = await this.findOne({ id: rootId });
      if (!rootNode) {
        return [];
      }
      
      return this.find({
        $or: [
          { id: rootId },
          { path: { $like: `${rootNode.path}/%` } }
        ]
      }, {
        orderBy: { depth: 'asc', position: 'asc' }
      });
    } else {
      // Get all nodes if no root specified
      return this.findAll({
        orderBy: { depth: 'asc', position: 'asc' }
      });
    }
  }

  /**
   * Get all collection IDs under a node (including the node itself if it has a collection)
   */
  async getDescendantCollectionIds(nodeId: string): Promise<string[]> {
    const node = await this.findOne({ id: nodeId });
    if (!node) {
      return [];
    }

    const descendants = await this.find({
      $or: [
        { id: nodeId },
        { path: { $like: `${node.path}/%` } }
      ],
      collection_id: { $ne: null }
    });

    return descendants
      .filter(n => n.collection_id)
      .map(n => n.collection_id as string);
  }

  /**
   * Check if moving a node would create a cycle
   */
  async wouldCreateCycle(nodeId: string, newParentId: string): Promise<boolean> {
    if (nodeId === newParentId) {
      return true;
    }

    const node = await this.findOne({ id: nodeId });
    if (!node) {
      return false;
    }

    // Check if newParentId is a descendant of nodeId
    const descendants = await this.findDescendants(nodeId);
    return descendants.some(d => d.id === newParentId);
  }

  /**
   * Get next position for a node under a parent
   */
  async getNextPosition(parentId: string | null): Promise<number> {
    const siblings = await this.find({
      parent_id: parentId || null
    });

    return siblings.length;
  }

  /**
   * Reorder siblings after position change
   */
  async reorderSiblings(parentId: string | null, orderedIds: string[]): Promise<void> {
    const em = this.getEntityManager();
    
    await em.transactional(async (em) => {
      for (let i = 0; i < orderedIds.length; i++) {
        const node = await em.findOne(CollectionHierarchyNode, { id: orderedIds[i] });
        if (node && node.parent_id === parentId) {
          node.position = i;
          em.persist(node);
        }
      }
    });
  }
}