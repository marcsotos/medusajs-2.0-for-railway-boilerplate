import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { getProductPrice } from "@lib/util/get-product-price"

interface ProductPricingProps {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}

const ProductPricing = ({ product, variant }: ProductPricingProps) => {
  const price = useMemo(() => {
    const productPrice = getProductPrice({
      product,
      variantId: variant?.id,
    })
    
    return variant ? productPrice.variantPrice : productPrice.cheapestPrice
  }, [product, variant])

  if (!price) {
    return (
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Precio principal */}
      <div className="flex items-center space-x-3">
        <span className="text-3xl font-bold text-teal-600">
          {price.calculated_price}
        </span>
        
        {/* Badge de descuento */}
        {price.price_type === "sale" && price.percentage_diff && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{price.percentage_diff}%
          </span>
        )}
      </div>
      
      {/* Precio original tachado si hay descuento */}
      {price.price_type === "sale" && price.original_price && (
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 line-through text-lg">
            Original: {price.original_price}
          </span>
        </div>
      )}
      
      {/* Stock status */}
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-green-600 font-medium">
          En stock - Envío rápido
        </span>
      </div>
      
      {/* Información adicional */}
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Devolución gratuita en 30 días</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Envío gratuito a partir de 30€</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Producto auténtico garantizado</span>
        </div>
      </div>
    </div>
  )
}

export default ProductPricing