import { HttpTypes } from "@medusajs/types"
import { getProductsByCategory } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getRegion } from "@lib/data/regions"

type ProductCategoryContentProps = {
  categoryId: string
  countryCode: string
  limit: number
  showViewAll: boolean
}

export default async function ProductCategoryContent({
  categoryId,
  countryCode,
  limit,
  showViewAll,
}: ProductCategoryContentProps) {
  const [products, region] = await Promise.all([
    getProductsByCategory({ categoryId, limit, countryCode }),
    getRegion(countryCode),
  ])

  if (!products.length || !region) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No hay productos disponibles en esta categoría.</p>
      </div>
    )
  }

  return (
    <>
      {/* Grid de Productos */}
      <ul 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
        data-testid="product-category-grid"
      >
        {products.map((product) => (
          <li key={product.id} className="group">
            <ProductPreview 
              product={product} 
              region={region}
            />
          </li>
        ))}
      </ul>

      {/* Botón Ver Todos */}
      {showViewAll && (
        <div className="text-center">
          <LocalizedClientLink
            href={`/collections/${categoryId}`}
            className="btn-secondary inline-flex items-center gap-2"
            data-testid="view-category-products"
          >
            Ver Categoría Completa
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </LocalizedClientLink>
        </div>
      )}
    </>
  )
}

