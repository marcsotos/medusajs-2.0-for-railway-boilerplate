import { Text } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getProductsById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

// Componente client para el botón de añadir
import AddToCartButton from "./add-to-cart-button"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const [pricedProduct] = await getProductsById({
    ids: [product.id!],
    regionId: region.id,
  })

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
  })

  // Función para generar valores consistentes basados en ID del producto
  const generateConsistentValue = (id: string, seed: number = 0) => {
    let hash = 0;
    const str = id + seed.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) / 2147483647;
  }

  // Usar datos reales de Medusa para descuentos, valores consistentes para rating/reviews
  const hasRealDiscount = cheapestPrice?.price_type === "sale"
  
  // TEMPORAL: Si no hay descuentos reales, simular algunos para testing
  const hasSimulatedDiscount = !hasRealDiscount && generateConsistentValue(product.id!, 3) > 0.6 // 40% de productos
  const hasDiscount = hasRealDiscount || hasSimulatedDiscount
  
  let discount = null
  let originalPrice = null
  
  if (hasRealDiscount && cheapestPrice?.percentage_diff) {
    // Usar descuento real de Medusa
    discount = parseInt(cheapestPrice.percentage_diff)
    originalPrice = cheapestPrice.original_price
  } else if (hasSimulatedDiscount) {
    // Simular descuento para testing
    discount = Math.floor(generateConsistentValue(product.id!, 4) * 30) + 10 // 10-40%
    const currentPriceNumber = parseFloat((cheapestPrice?.calculated_price || "13,99").replace(/[^\d,]/g, '').replace(',', '.'))
    if (!isNaN(currentPriceNumber)) {
      const originalPriceNumber = currentPriceNumber / (1 - discount / 100)
      originalPrice = `${originalPriceNumber.toFixed(2).replace('.', ',')} €`
    }
  }
  
  const rating = (generateConsistentValue(product.id!, 1) * 2 + 3).toFixed(1) // 3.0-5.0 rating consistente
  const reviews = Math.floor(generateConsistentValue(product.id!, 2) * 200) + 10 // 10-210 reviews consistente

  return (
    <div className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Badge de descuento - solo si hay descuento */}
      {hasDiscount && discount && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        </div>
      )}

      {/* Icono de favorito */}
      <button className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
        <svg className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <LocalizedClientLink href={`/products/${product.handle}`} className="block">
        {/* Imagen del producto */}
        <div className="aspect-square p-4 bg-gray-50">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="w-full h-full border-0 shadow-none bg-transparent"
          />
        </div>

        {/* Información del producto */}
        <div className="p-4 space-y-2">
          {/* Título */}
          <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Información adicional */}
          <p className="text-xs text-gray-500">
            {product.subtitle || "Formato estándar"}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(parseFloat(rating)) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({reviews})</span>
          </div>

          {/* Disponibilidad */}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 font-medium">Disponible</span>
          </div>

          {/* Precios */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {cheapestPrice?.calculated_price}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </LocalizedClientLink>

      {/* Botón Añadir - Componente client separado */}
      <div className="p-4 pt-0">
        <AddToCartButton 
          product={pricedProduct}
          variant={pricedProduct.variants?.[0]}
        />
      </div>
    </div>
  )
}
