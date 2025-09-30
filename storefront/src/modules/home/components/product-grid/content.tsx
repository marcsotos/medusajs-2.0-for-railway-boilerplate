import { HttpTypes } from "@medusajs/types"
import { getFeaturedProducts } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getRegion } from "@lib/data/regions"

type ProductGridContentProps = {
  countryCode: string
  limit: number
  showViewAll: boolean
}

export default async function ProductGridContent({
  countryCode,
  limit,
  showViewAll,
}: ProductGridContentProps) {
  const [products, region] = await Promise.all([
    getFeaturedProducts({ limit, countryCode }),
    getRegion(countryCode),
  ])

  if (!products.length || !region) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No hay productos disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <>
      {/* Grid de Productos */}
      <ul 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
        data-testid="product-grid"
      >
        {products.map((product) => (
          <li key={product.id} className="group">
            <ProductPreview 
              product={product} 
              region={region}
              isFeatured={true}
            />
          </li>
        ))}
      </ul>

      {/* Botón Ver Todos */}
      {showViewAll && (
        <div className="text-center">
          <LocalizedClientLink
            href="/store"
            className="btn-primary inline-flex items-center gap-2"
            data-testid="view-all-products"
          >
            Ver Todos los Productos
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

