// Base node interfaces
export interface CreateNodeInput {
  name: string;
  slug?: string;
  collection_id?: string | null;
  parent_id?: string | null;
  position?: number;
  metadata?: Record<string, any> | null;
}

export interface UpdateNodeInput {
  name?: string;
  slug?: string;
  collection_id?: string | null;
  metadata?: Record<string, any> | null;
}

export interface MoveNodeInput {
  new_parent_id: string | null;
  new_position?: number;
}

export interface ReorderSiblingsInput {
  parent_id?: string | null;
  ordered_ids: string[];
}

// Query interfaces
export interface GetTreeInput {
  root_id?: string;
  include_products?: boolean;
}

export interface GetProductsInput {
  limit?: number;
  offset?: number;
  region_id?: string;
  currency_code?: string;
  cart_id?: string;
}

// Response interfaces
export interface NodeResponse {
  id: string;
  collection_id: string | null;
  parent_id: string | null;
  name: string;
  slug: string;
  path: string;
  depth: number;
  position: number;
  metadata: Record<string, any> | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface TreeNodeResponse extends NodeResponse {
  children?: TreeNodeResponse[];
}

export interface BreadcrumbResponse {
  id: string;
  name: string;
  slug: string;
  path: string;
}

// Validation functions
export function validateCreateNodeInput(input: any): CreateNodeInput {
  if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
    throw new Error('Name is required and must be a non-empty string');
  }

  if (input.name.length > 255) {
    throw new Error('Name must not exceed 255 characters');
  }

  if (input.slug && typeof input.slug !== 'string') {
    throw new Error('Slug must be a string');
  }

  if (input.collection_id && typeof input.collection_id !== 'string') {
    throw new Error('Collection ID must be a string');
  }

  if (input.parent_id && typeof input.parent_id !== 'string') {
    throw new Error('Parent ID must be a string');
  }

  if (input.position !== undefined && (!Number.isInteger(input.position) || input.position < 0)) {
    throw new Error('Position must be a non-negative integer');
  }

  return {
    name: input.name.trim(),
    slug: input.slug?.trim(),
    collection_id: input.collection_id || null,
    parent_id: input.parent_id || null,
    position: input.position,
    metadata: input.metadata || null,
  };
}

export function validateUpdateNodeInput(input: any): UpdateNodeInput {
  const result: UpdateNodeInput = {};

  if (input.name !== undefined) {
    if (typeof input.name !== 'string' || input.name.trim().length === 0) {
      throw new Error('Name must be a non-empty string');
    }
    if (input.name.length > 255) {
      throw new Error('Name must not exceed 255 characters');
    }
    result.name = input.name.trim();
  }

  if (input.slug !== undefined) {
    if (typeof input.slug !== 'string') {
      throw new Error('Slug must be a string');
    }
    result.slug = input.slug.trim();
  }

  if (input.collection_id !== undefined) {
    if (input.collection_id && typeof input.collection_id !== 'string') {
      throw new Error('Collection ID must be a string');
    }
    result.collection_id = input.collection_id || null;
  }

  if (input.metadata !== undefined) {
    result.metadata = input.metadata || null;
  }

  return result;
}

export function validateMoveNodeInput(input: any): MoveNodeInput {
  if (input.new_parent_id !== null && typeof input.new_parent_id !== 'string') {
    throw new Error('New parent ID must be a string or null');
  }

  if (input.new_position !== undefined && (!Number.isInteger(input.new_position) || input.new_position < 0)) {
    throw new Error('New position must be a non-negative integer');
  }

  return {
    new_parent_id: input.new_parent_id,
    new_position: input.new_position,
  };
}

export function validateReorderSiblingsInput(input: any): ReorderSiblingsInput {
  if (!Array.isArray(input.ordered_ids)) {
    throw new Error('Ordered IDs must be an array');
  }

  if (input.ordered_ids.some((id: any) => typeof id !== 'string')) {
    throw new Error('All ordered IDs must be strings');
  }

  if (input.parent_id !== undefined && input.parent_id !== null && typeof input.parent_id !== 'string') {
    throw new Error('Parent ID must be a string or null');
  }

  return {
    parent_id: input.parent_id,
    ordered_ids: input.ordered_ids,
  };
}

export function validateGetProductsInput(input: any): GetProductsInput {
  const result: GetProductsInput = {};

  if (input.limit !== undefined) {
    if (!Number.isInteger(input.limit) || input.limit < 1 || input.limit > 100) {
      throw new Error('Limit must be an integer between 1 and 100');
    }
    result.limit = input.limit;
  }

  if (input.offset !== undefined) {
    if (!Number.isInteger(input.offset) || input.offset < 0) {
      throw new Error('Offset must be a non-negative integer');
    }
    result.offset = input.offset;
  }

  if (input.region_id && typeof input.region_id !== 'string') {
    throw new Error('Region ID must be a string');
  }

  if (input.currency_code && typeof input.currency_code !== 'string') {
    throw new Error('Currency code must be a string');
  }

  if (input.cart_id && typeof input.cart_id !== 'string') {
    throw new Error('Cart ID must be a string');
  }

  return {
    ...result,
    region_id: input.region_id,
    currency_code: input.currency_code,
    cart_id: input.cart_id,
  };
}