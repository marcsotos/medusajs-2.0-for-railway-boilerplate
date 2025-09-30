# Collection Hierarchy Module

Este módulo implementa un sistema de jerarquía de colecciones para Medusa v2, permitiendo crear estructuras de árbol (padre-hijo) para organizar las colecciones de productos.

## Características

- ✅ **Jerarquía de nodos**: Soporte para árboles profundos con estructura padre-hijo
- ✅ **Enlace a colecciones**: Vincula nodos jerárquicos con `product_collection` existentes
- ✅ **Slugs únicos**: Generación automática de slugs URL-friendly
- ✅ **Paths calculados**: Rutas automáticas tipo `/parent/child/grandchild`
- ✅ **Reordenación**: Cambio de posición y reordenación de hermanos
- ✅ **Movimiento de nodos**: Mover nodos entre padres con validación de ciclos
- ✅ **Breadcrumbs**: Navegación jerárquica completa
- ✅ **APIs Admin y Store**: Endpoints completos para gestión y consulta
- ✅ **Soft delete**: Eliminación suave con cascada opcional
- ✅ **Metadata**: Campo JSON para datos adicionales
- ✅ **Performance optimizada**: Consultas optimizadas con path-based queries

## Instalación y Configuración

### 1. Registrar el módulo

En tu `medusa-config.js`, añade el módulo:

```javascript
const modules = {
  // ... otros módulos
  collectionHierarchy: {
    resolve: "./src/modules/collection-hierarchy",
    options: {
      // Opciones del módulo si las necesitas
    },
  },
}
```

### 2. Ejecutar migraciones

```bash
npx medusa migrations run
```

### 3. Seed inicial (opcional)

Para crear una jerarquía de ejemplo:

```bash
npx medusa exec ./src/modules/collection-hierarchy/loaders/seed.ts
```

## Uso de las APIs

### APIs Admin

Base URL: `/admin/collection-hierarchy`

#### Crear nodo

```http
POST /admin/collection-hierarchy/nodes
Content-Type: application/json

{
  "name": "Chuches",
  "slug": "chuches",
  "collection_id": null,
  "parent_id": null,
  "position": 0,
  "metadata": {
    "description": "Todas las golosinas",
    "is_public": true
  }
}
```

#### Crear nodo hijo

```http
POST /admin/collection-hierarchy/nodes
Content-Type: application/json

{
  "name": "Sin Gluten",
  "collection_id": "pcol_01234567890",
  "parent_id": "chn_parent_id",
  "position": 1
}
```

#### Obtener árbol completo

```http
GET /admin/collection-hierarchy/nodes/tree
```

#### Obtener subárbol desde un nodo

```http
GET /admin/collection-hierarchy/nodes/tree?root_id=chn_01234567890
```

#### Mover nodo

```http
POST /admin/collection-hierarchy/nodes/{id}/move
Content-Type: application/json

{
  "new_parent_id": "chn_new_parent",
  "new_position": 2
}
```

#### Reordenar hermanos

```http
POST /admin/collection-hierarchy/nodes/reorder
Content-Type: application/json

{
  "parent_id": "chn_parent_id",
  "ordered_ids": ["chn_child1", "chn_child3", "chn_child2"]
}
```

#### Obtener breadcrumbs

```http
GET /admin/collection-hierarchy/nodes/{id}/breadcrumbs
```

#### Actualizar nodo

```http
PATCH /admin/collection-hierarchy/nodes/{id}
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "metadata": {
    "updated": true
  }
}
```

#### Eliminar nodo

```http
DELETE /admin/collection-hierarchy/nodes/{id}
```

#### Eliminar nodo y descendientes

```http
DELETE /admin/collection-hierarchy/nodes/{id}?cascade=true
```

### APIs Store

Base URL: `/store/collection-hierarchy`

#### Obtener árbol público

```http
GET /store/collection-hierarchy/nodes/tree
```

#### Obtener productos bajo un nodo

```http
GET /store/collection-hierarchy/nodes/{id}/products?limit=20&offset=0
```

#### Obtener breadcrumbs (público)

```http
GET /store/collection-hierarchy/nodes/{id}/breadcrumbs
```

## Estructura de datos

### Modelo CollectionHierarchyNode

```typescript
interface CollectionHierarchyNode {
  id: string;              // ULID: chn_01234567890
  collection_id?: string;  // FK a product_collection (opcional)
  parent_id?: string;      // FK a otro nodo (null = raíz)
  name: string;            // Nombre del nodo
  slug: string;            // Slug único
  path: string;            // Ruta calculada: "parent/child"
  depth: number;           // Profundidad: 0 = raíz
  position: number;        // Orden entre hermanos
  metadata?: object;       // Datos adicionales en JSON
}
```

### Ejemplo de respuesta de árbol

```json
{
  "tree": [
    {
      "id": "chn_01234567890",
      "name": "Chuches",
      "slug": "chuches",
      "path": "chuches",
      "depth": 0,
      "position": 0,
      "collection_id": null,
      "parent_id": null,
      "metadata": {
        "description": "Todas las golosinas",
        "is_public": true
      },
      "children": [
        {
          "id": "chn_01234567891",
          "name": "Sin Gluten",
          "slug": "sin-gluten",
          "path": "chuches/sin-gluten",
          "depth": 1,
          "position": 0,
          "collection_id": "pcol_01234567890",
          "parent_id": "chn_01234567890",
          "metadata": {
            "dietary": "gluten-free"
          },
          "children": []
        }
      ]
    }
  ]
}
```

## Integración con productos

### Obtener productos de un nodo y sus descendientes

El endpoint `/store/collection-hierarchy/nodes/{id}/products` devuelve todos los productos de las colecciones asociadas al nodo y sus descendientes.

```typescript
// En el frontend
const response = await fetch(`/store/collection-hierarchy/nodes/chn_chuches/products?limit=20`);
const { products, count, collection_ids } = await response.json();
```

### Usar en componentes de navegación

```tsx
// Ejemplo React
function CategoryNav() {
  const [tree, setTree] = useState([]);

  useEffect(() => {
    fetch('/store/collection-hierarchy/nodes/tree')
      .then(res => res.json())
      .then(data => setTree(data.tree));
  }, []);

  return (
    <nav>
      {tree.map(node => (
        <CategoryNode key={node.id} node={node} />
      ))}
    </nav>
  );
}

function CategoryNode({ node }) {
  return (
    <div>
      <Link to={`/collections/${node.slug}`}>
        {node.name}
      </Link>
      {node.children?.length > 0 && (
        <ul>
          {node.children.map(child => (
            <li key={child.id}>
              <CategoryNode node={child} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Casos de uso avanzados

### Clusters para frontend

Usa el campo `metadata.cluster_key` para agrupar nodos:

```http
POST /admin/collection-hierarchy/nodes
{
  "name": "Ofertas Especiales",
  "metadata": {
    "cluster_key": "featured",
    "is_featured": true
  }
}
```

### Filtros de visibilidad

Control de visibilidad usando metadata:

```http
POST /admin/collection-hierarchy/nodes
{
  "name": "Productos Staff",
  "metadata": {
    "is_public": false,
    "staff_only": true
  }
}
```

### Datos adicionales en metadata

```json
{
  "metadata": {
    "seo_title": "Las mejores chuches sin gluten",
    "seo_description": "Descubre nuestra selección...",
    "banner_image": "/images/gluten-free-banner.jpg",
    "sort_order": "price_asc",
    "featured_products": ["prod_123", "prod_456"],
    "filters": {
      "dietary": ["gluten-free", "sugar-free"],
      "brand": ["Haribo", "Fini"]
    }
  }
}
```

## Performance y optimización

### Consultas optimizadas

El módulo usa consultas optimizadas basadas en el campo `path`:

- **Descendientes**: `WHERE path LIKE 'parent/child/%'`
- **Ancestros**: Búsqueda por path components
- **Hermanos**: `WHERE parent_id = ? AND id != ?`

### Índices de base de datos

Se crean automáticamente índices en:
- `parent_id`
- `path`
- `position`
- `collection_id`
- `slug` (único)

### Caché recomendado

Para aplicaciones con mucho tráfico, considera cachear:

```typescript
// Ejemplo con Redis
const cacheKey = `hierarchy:tree:${rootId || 'all'}`;
let tree = await redis.get(cacheKey);

if (!tree) {
  tree = await collectionHierarchyService.getTree(rootId);
  await redis.setex(cacheKey, 3600, JSON.stringify(tree)); // 1 hora
}
```

## Eventos y extensibilidad

### Eventos emitidos

El módulo está preparado para emitir eventos (funcionalidad futura):

- `collection_hierarchy.node.created`
- `collection_hierarchy.node.updated`
- `collection_hierarchy.node.deleted`
- `collection_hierarchy.node.moved`
- `collection_hierarchy.node.reordered`

### Extensión personalizada

Puedes extender el servicio para casos específicos:

```typescript
class CustomCollectionHierarchyService extends CollectionHierarchyService {
  async getNodesByCluster(clusterKey: string) {
    return this.nodeRepository_.find({
      metadata: { cluster_key: clusterKey }
    });
  }

  async getFeaturedNodes() {
    return this.nodeRepository_.find({
      metadata: { is_featured: true }
    });
  }
}
```

## Troubleshooting

### Error: Node with slug already exists

**Causa**: Intentas crear un nodo con un slug que ya existe.

**Solución**: Usa un slug diferente o deja que se genere automáticamente.

### Error: Moving node would create a cycle

**Causa**: Intentas mover un nodo padre para que sea hijo de uno de sus descendientes.

**Solución**: Revisa la estructura del árbol antes de mover.

### Error: Cannot delete node with children

**Causa**: Intentas eliminar un nodo que tiene hijos sin usar `cascade=true`.

**Solución**: Usa `?cascade=true` o mueve/elimina los hijos primero.

### Performance lenta en árboles grandes

**Soluciones**:
1. Implementa caché para el árbol completo
2. Usa paginación en listados
3. Considera lazy loading para nodos con muchos hijos

## Contribuir

### Ejecutar tests

```bash
npm run test -- src/modules/collection-hierarchy
```

### Agregar nuevas funcionalidades

1. Extiende el servicio base
2. Añade endpoints en las APIs
3. Actualiza los tipos TypeScript
4. Escribe tests para nuevas funcionalidades

## Licencia

Este módulo está diseñado para ser compatible con la licencia de Medusa y puede ser usado libremente en proyectos comerciales.