import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      {/* Contenedor principal del producto */}
      <div
        className="content-container flex flex-col lg:flex-row lg:items-start py-6 lg:py-12 gap-8 lg:gap-12 relative"
        data-testid="product-container"
      >
        {/* Columna izquierda: Galería de imágenes (60% del espacio) */}
        <div className="w-full lg:w-[60%] lg:sticky lg:top-24">
          <ImageGallery images={product?.images || []} />
        </div>

        {/* Columna derecha: Información y acciones (40% del espacio) */}
        <div className="w-full lg:w-[40%] flex flex-col gap-y-8">
          {/* Información del producto */}
          <ProductInfo product={product} />

          {/* Separator visual */}
          <div className="border-t border-ui-border-base" />

          {/* CTA de Onboarding (si aplica) */}
          <ProductOnboardingCta />

          {/* Acciones del producto (Add to cart, variantes, etc) */}
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          {/* Separator visual */}
          <div className="border-t border-ui-border-base" />

          {/* Tabs de información adicional */}
          <ProductTabs product={product} />
        </div>
      </div>

      {/* Productos relacionados */}
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate