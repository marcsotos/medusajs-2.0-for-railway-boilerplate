import { getProductsById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  onVariantChange,
}: {
  id: string
  region: HttpTypes.StoreRegion
  onVariantChange?: (variant: HttpTypes.StoreProductVariant) => void
}) {
  console.log('🎯 ProductActionsWrapper iniciando con ID:', id)
  
  try {
    const products = await getProductsById({
      ids: [id],
      regionId: region.id,
    })

    console.log('🎯 ProductActionsWrapper productos obtenidos:', products?.length)
    const product = products?.[0]

    if (!product) {
      console.log('❌ ProductActionsWrapper: No se encontró producto')
      return null
    }

    console.log('✅ ProductActionsWrapper: Producto encontrado, renderizando ProductActions')
    console.log('🔍 Variantes del producto:', product.variants?.length)
    console.log('🔍 Opciones del producto:', product.options?.length)

    return (
      <ProductActions 
        product={product} 
        region={region}
        onVariantChange={onVariantChange}
      />
    )
  } catch (error) {
    console.error('❌ ProductActionsWrapper error:', error)
    return <div>Error loading product actions</div>
  }
}