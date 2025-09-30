"use client"

import React, { Suspense, useState, useEffect } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

// Componentes nuevos para el diseño de farmacia
import ProductHeader from "@modules/products/templates/product-header"
import ProductPricing from "./product-pricing"  
import ProductFeatures from "../components/product-features"
import ProductShipping from "../components/product-shipping"

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
  // Estado para manejar las imágenes actuales según la variante seleccionada
  const [currentImages, setCurrentImages] = useState(product?.images || [])
  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.StoreProductVariant | null>(
    product?.variants?.[0] || null
  )

  if (!product || !product.id) {
    return notFound()
  }

  // Función para actualizar imágenes cuando cambia la variante
  const handleVariantChange = (variant: HttpTypes.StoreProductVariant) => {
    setSelectedVariant(variant)
    
    // En Medusa v2, las variantes pueden tener imágenes en metadata
    const variantMetadata = variant?.metadata as any
    
    if (variantMetadata?.images && Array.isArray(variantMetadata.images)) {
      const metadataImages = variantMetadata.images.map((img: any, index: number) => ({
        url: typeof img === 'string' ? img : img.url,
        id: typeof img === 'string' ? `${variant.id}-${index}` : img.id,
        rank: typeof img === 'object' && img.rank !== undefined ? img.rank : index,
      }))
      setCurrentImages(metadataImages)
    } else if (variantMetadata?.image_url) {
      setCurrentImages([{ 
        url: variantMetadata.image_url, 
        id: `${variant.id}-image`,
        rank: 0,
      }])
    } else {
      setCurrentImages(product?.images || [])
    }
  }

  return (
    <>
      {/* Contenedor principal del producto */}
      <div className="max-w-7xl mx-auto px-4 py-8" data-testid="product-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Galería de imágenes - Lado izquierdo */}
          <div className="w-full">
            <div className="lg:sticky lg:top-8">
              <ImageGallery images={currentImages} />
            </div>
          </div>

          {/* Información del producto - Lado derecho */}
          <div className="w-full space-y-6">
            
            {/* Header del producto (título, rating, disponibilidad) */}
            <ProductHeader product={product} />
            
            {/* Información de descuento y precio */}
            <ProductPricing 
              product={product} 
              variant={selectedVariant || undefined}
            />

            {/* Selector de variantes y botón añadir - COMPONENTE EXISTENTE */}
            <div className="space-y-4">
              <ProductActions 
                product={product} 
                region={region}
                onVariantChange={handleVariantChange}
              />
            </div>

            {/* Información de envío y devoluciones */}
            <ProductShipping />

            {/* Características del producto */}
            <ProductFeatures product={product} />

            {/* Información adicional de Atida Cash */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Gana +0,14 € en Atida Cash</p>
                  <p className="text-sm text-gray-600">Acumula Atida Cash en tu monedero MyAtida.</p>
                </div>
              </div>
            </div>

            {/* Métodos de pago */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-sm text-gray-600">Pago seguro</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">PP</div>
                <div className="w-8 h-5 bg-teal-500 rounded text-white text-xs flex items-center justify-center font-bold">B</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detalles del producto - Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductTabs product={product} />
      </div>

      {/* Productos relacionados */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate