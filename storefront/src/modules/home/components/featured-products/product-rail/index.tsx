import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const { products } = collection

  if (!products) {
    return null
  }

  return (
    <div className="section-container bg-white">
      <div className="content-container">
        {/* Header de la sección */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="heading-section">{collection.title}</h2>
          </div>
          
          <div className="flex items-center gap-2 text-[#2d3748] font-semibold group">
            <InteractiveLink href={`/collections/${collection.handle}`}>
              Ver todos
            </InteractiveLink>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
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
          </div>
        </div>

        {/* Grid de productos */}
        <div className="relative">
          {/* Indicador de scroll en móvil */}
          <div className="block sm:hidden absolute -top-6 right-0 text-xs text-gray-500 flex items-center gap-1">
            <span>Desliza</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Grid responsive */}
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products &&
              products.map((product, index) => (
                <li 
                  key={product.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* @ts-ignore */}
                  <ProductPreview 
                    product={product} 
                    region={region} 
                    isFeatured 
                  />
                </li>
              ))}
          </ul>
        </div>

        {/* Contador de productos */}
        {products.length > 0 && (
          <div className="mt-6 text-center">
            <Text className="text-small-regular text-gray-500">
              Mostrando {Math.min(products.length, 10)} de {products.length} productos
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

// Variante con carrusel horizontal
export function ProductRailCarousel({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const { products } = collection

  if (!products) {
    return null
  }

  return (
    <div className="section-container bg-gray-50">
      <div className="content-container">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="heading-section">{collection.title}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Botones de navegación del carrusel */}
            <button 
              className="hidden sm:flex w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:shadow-lg smooth-transition hover:bg-gray-50"
              aria-label="Anterior"
            >
              <svg className="w-5 h-5 text-[#2d3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="hidden sm:flex w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:shadow-lg smooth-transition hover:bg-gray-50"
              aria-label="Siguiente"
            >
              <svg className="w-5 h-5 text-[#2d3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <InteractiveLink href={`/collections/${collection.handle}`}>
              Ver más
            </InteractiveLink>
          </div>
        </div>

        {/* Carrusel de productos */}
        <div className="relative overflow-hidden">
          <ul className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 scroll-smooth">
            {products &&
              products.map((product) => (
                <li 
                  key={product.id}
                  className="product-card flex-none w-[160px] sm:w-[200px] md:w-[240px] snap-start"
                >
                  {/* @ts-ignore */}
                  <ProductPreview 
                    product={product} 
                    region={region} 
                    isFeatured 
                  />
                </li>
              ))}
          </ul>
        </div>

        {/* Indicadores de posición */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(products.length / 4) }).map((_, i) => (
            <button
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === 0 
                  ? 'w-8 bg-[#2d3748]' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a grupo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}