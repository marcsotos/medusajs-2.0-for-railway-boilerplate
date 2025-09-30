import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { getFeaturedProducts } from "@lib/data/products"
import ProductGridSkeleton from "./skeleton"
import ProductGridContent from "./content"

type ProductGridProps = {
  countryCode: string
  limit?: number
  title?: string
  subtitle?: string
  showViewAll?: boolean
}

export default async function ProductGrid({
  countryCode,
  limit = 8,
  title = "Productos Destacados",
  subtitle,
  showViewAll = true,
}: ProductGridProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" data-testid="product-grid-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Mejorado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <span className="text-sm font-medium text-orange-600 uppercase tracking-wider">
              Colección
            </span>
            <div className="w-8 h-0.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Product Grid */}
        <Suspense fallback={<ProductGridSkeleton limit={limit} />}>
          <ProductGridContent
            countryCode={countryCode}
            limit={limit}
            showViewAll={showViewAll}
          />
        </Suspense>
      </div>
    </section>
  )
}
