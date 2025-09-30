import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductsByCategory } from "@lib/data/products"
import ProductGridSkeleton from "./skeleton"
import ProductCategoryContent from "./category-content"

type ProductCategoryGridProps = {
  categoryId: string
  countryCode: string
  limit?: number
  title?: string
  subtitle?: string
  showViewAll?: boolean
}

export default async function ProductCategoryGrid({
  categoryId,
  countryCode,
  limit = 6,
  title,
  subtitle,
  showViewAll = true,
}: ProductCategoryGridProps) {
  return (
    <section className="section-container bg-gray-50" data-testid="product-category-grid-section">
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading-section">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Product Grid */}
        <Suspense fallback={<ProductGridSkeleton limit={limit} />}>
          <ProductCategoryContent 
            categoryId={categoryId}
            countryCode={countryCode} 
            limit={limit}
            showViewAll={showViewAll}
          />
        </Suspense>
      </div>
    </section>
  )
}

