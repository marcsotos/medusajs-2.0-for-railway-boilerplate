"use client"

import { useState } from "react"
import { Text, Button } from "@medusajs/ui"
import { ShoppingCart } from "@medusajs/icons"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { HttpTypes } from "@medusajs/types"

type ProductCardProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isFeatured?: boolean
}

export default function ProductCard({
  product,
  region,
  isFeatured = false,
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const { cheapestPrice } = getProductPrice({
    product: product,
  })

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAddingToCart(true)
    
    try {
      // Aquí implementarías la lógica para añadir al carrito
      // Por ahora solo simulamos la acción
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mostrar feedback al usuario
      console.log(`Producto ${product.title} añadido al carrito`)
    } catch (error) {
      console.error('Error añadiendo al carrito:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Imagen del producto */}
      <LocalizedClientLink href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay con botón de añadir al carrito */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-slate-900 hover:bg-gray-100 border-0 shadow-lg"
              size="small"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAddingToCart ? "Añadiendo..." : "Añadir al carrito"}
            </Button>
          </div>
        </div>
      </LocalizedClientLink>

      {/* Información del producto */}
      <div className="p-4">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <h3 className="text-sm font-medium text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition-colors">
            {product.title}
          </h3>
        </LocalizedClientLink>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
          
          {/* Badge de destacado */}
          {isFeatured && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Destacado
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

