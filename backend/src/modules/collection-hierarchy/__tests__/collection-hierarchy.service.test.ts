import { EntityManager } from "@mikro-orm/core";
import CollectionHierarchyService from "../services/collection-hierarchy";
import { CollectionHierarchyNode } from "../models/collection-hierarchy-node";
import { CollectionHierarchyNodeRepository } from "../repositories/collection-hierarchy-node";

// Mock EntityManager and Repository
const mockEM = {
  transactional: jest.fn().mockImplementation((cb) => cb(mockEM)),
  getRepository: jest.fn(),
  persistAndFlush: jest.fn(),
  removeAndFlush: jest.fn(),
  flush: jest.fn(),
  persist: jest.fn(),
} as unknown as EntityManager;

const mockRepo = {
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  getNextPosition: jest.fn(),
  findDescendants: jest.fn(),
  findAncestors: jest.fn(),
  wouldCreateCycle: jest.fn(),
  reorderSiblings: jest.fn(),
  getTreeFrom: jest.fn(),
  getDescendantCollectionIds: jest.fn(),
} as unknown as CollectionHierarchyNodeRepository;

describe("CollectionHierarchyService", () => {
  let service: CollectionHierarchyService;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockEM.getRepository as jest.Mock).mockReturnValue(mockRepo);
    
    service = new CollectionHierarchyService({ manager: mockEM });
  });

  describe("createNode", () => {
    it("should create a root node successfully", async () => {
      const input = {
        name: "Test Category",
        slug: "test-category",
        collection_id: null,
        parent_id: null,
        position: 0,
      };

      const mockNode = {
        id: "chn_test123",
        name: "Test Category",
        slug: "test-category",
        path: "test-category",
        depth: 0,
        position: 0,
        collection_id: null,
        parent_id: null,
        metadata: null,
      };

      (mockRepo.findOne as jest.Mock).mockResolvedValue(null); // No existing slug
      (mockRepo.getNextPosition as jest.Mock).mockResolvedValue(0);
      (mockRepo.create as jest.Mock).mockReturnValue(mockNode);

      const result = await service.createNode(input);

      expect(mockRepo.create).toHaveBeenCalledWith({
        name: "Test Category",
        slug: "test-category",
        collection_id: null,
        parent_id: null,
        position: 0,
        metadata: null,
      });

      expect(result.name).toBe("Test Category");
      expect(result.slug).toBe("test-category");
    });

    it("should throw error if slug already exists", async () => {
      const input = {
        name: "Test Category",
        slug: "existing-slug",
        collection_id: null,
        parent_id: null,
      };

      const existingNode = { id: "existing", slug: "existing-slug" };
      (mockRepo.findOne as jest.Mock).mockResolvedValue(existingNode);

      await expect(service.createNode(input)).rejects.toThrow(
        'Node with slug "existing-slug" already exists'
      );
    });

    it("should throw error if parent does not exist", async () => {
      const input = {
        name: "Test Category",
        parent_id: "non-existent",
      };

      (mockRepo.findOne as jest.Mock)
        .mockResolvedValueOnce(null) // First call for slug check
        .mockResolvedValueOnce(null); // Second call for parent check

      await expect(service.createNode(input)).rejects.toThrow(
        'Parent node with id "non-existent" not found'
      );
    });
  });

  describe("updateNode", () => {
    it("should update node successfully", async () => {
      const mockNode = {
        id: "chn_test123",
        name: "Old Name",
        slug: "old-slug",
        collection_id: null,
        parent_id: null,
        metadata: null,
      };

      const updateInput = {
        name: "New Name",
        metadata: { updated: true },
      };

      (mockRepo.findOne as jest.Mock).mockResolvedValue(mockNode);

      const result = await service.updateNode("chn_test123", updateInput);

      expect(mockNode.name).toBe("New Name");
      expect(mockNode.metadata).toEqual({ updated: true });
      expect(mockEM.persistAndFlush).toHaveBeenCalledWith(mockNode);
    });

    it("should throw error if node not found", async () => {
      (mockRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateNode("non-existent", { name: "New Name" })
      ).rejects.toThrow('Node with id "non-existent" not found');
    });
  });

  describe("moveNode", () => {
    it("should move node successfully", async () => {
      const mockNode = {
        id: "chn_test123",
        parent_id: "old_parent",
        position: 0,
      };

      const mockNewParent = {
        id: "new_parent",
        name: "New Parent",
      };

      const moveInput = {
        new_parent_id: "new_parent",
        new_position: 1,
      };

      (mockRepo.findOne as jest.Mock)
        .mockResolvedValueOnce(mockNode) // Find node to move
        .mockResolvedValueOnce(mockNewParent); // Find new parent

      (mockRepo.wouldCreateCycle as jest.Mock).mockResolvedValue(false);

      await service.moveNode("chn_test123", moveInput);

      expect(mockNode.parent_id).toBe("new_parent");
      expect(mockNode.position).toBe(1);
      expect(mockEM.persistAndFlush).toHaveBeenCalledWith(mockNode);
    });

    it("should throw error if would create cycle", async () => {
      const mockNode = { id: "chn_test123" };
      const mockNewParent = { id: "new_parent" };

      (mockRepo.findOne as jest.Mock)
        .mockResolvedValueOnce(mockNode)
        .mockResolvedValueOnce(mockNewParent);

      (mockRepo.wouldCreateCycle as jest.Mock).mockResolvedValue(true);

      await expect(
        service.moveNode("chn_test123", {
          new_parent_id: "new_parent",
        })
      ).rejects.toThrow("Moving node would create a cycle");
    });
  });

  describe("deleteNode", () => {
    it("should delete node without children", async () => {
      const mockNode = { id: "chn_test123", name: "Test" };

      (mockRepo.findOne as jest.Mock).mockResolvedValue(mockNode);
      (mockRepo.findChildren as jest.Mock).mockResolvedValue([]);

      await service.deleteNode("chn_test123");

      expect(mockEM.removeAndFlush).toHaveBeenCalledWith(mockNode);
    });

    it("should throw error if node has children and cascade is false", async () => {
      const mockNode = { id: "chn_test123", name: "Test" };
      const mockChildren = [{ id: "child1" }];

      (mockRepo.findOne as jest.Mock).mockResolvedValue(mockNode);
      (mockRepo.findChildren as jest.Mock).mockResolvedValue(mockChildren);

      await expect(service.deleteNode("chn_test123", false)).rejects.toThrow(
        "Cannot delete node with children. Use cascade=true to delete children as well"
      );
    });

    it("should delete node with children when cascade is true", async () => {
      const mockNode = { id: "chn_test123", name: "Test" };
      const mockChildren = [{ id: "child1" }];
      const mockDescendants = [{ id: "child1" }, { id: "grandchild1" }];

      (mockRepo.findOne as jest.Mock).mockResolvedValue(mockNode);
      (mockRepo.findChildren as jest.Mock).mockResolvedValue(mockChildren);
      (mockRepo.findDescendants as jest.Mock).mockResolvedValue(mockDescendants);

      await service.deleteNode("chn_test123", true);

      expect(mockEM.removeAndFlush).toHaveBeenCalledTimes(3); // descendants + node
    });
  });

  describe("getBreadcrumbs", () => {
    it("should return breadcrumbs for a node", async () => {
      const mockNode = {
        id: "chn_child",
        name: "Child",
        slug: "child",
        path: "parent/child",
      };

      const mockAncestors = [
        {
          id: "chn_parent",
          name: "Parent",
          slug: "parent",
          path: "parent",
        },
      ];

      (mockRepo.findOne as jest.Mock).mockResolvedValue(mockNode);
      (mockRepo.findAncestors as jest.Mock).mockResolvedValue(mockAncestors);

      const result = await service.getBreadcrumbs("chn_child");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "chn_parent",
        name: "Parent",
        slug: "parent",
        path: "parent",
      });
      expect(result[1]).toEqual({
        id: "chn_child",
        name: "Child",
        slug: "child",
        path: "parent/child",
      });
    });
  });
});