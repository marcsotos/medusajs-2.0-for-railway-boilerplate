"use client"

import { addToCart } from "@lib/data/cart"
import { useState } from "react"
import { useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

interface AddToCartButtonProps {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}

export default function AddToCartButton({ product, variant }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Evitar que se navegue al producto
    e.stopPropagation()

    const variantToAdd = variant || product.variants?.[0]
    if (!variantToAdd?.id) {
      console.error('No variant available for product')
      return
    }

    setIsAdding(true)
    try {
      await addToCart({
        variantId: variantToAdd.id,
        quantity: 1,
        countryCode,
      })
      console.log('Product added to cart successfully')
    } catch (error) {
      console.error('Error adding product to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isAdding || !variant?.id}
      className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
    >
      {isAdding ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
          </svg>
          Añadiendo...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1m-5-6h14m-5 6v6a1 1 0 001 1h1m-1-9a1 1 0 011 1v4a1 1 0 01-1 1m-6 0a1 1 0 001-1v-4a1 1 0 011-1m-2 6h2m0 0h2" />
          </svg>
          Añadir
        </>
      )}
    </button>
  )
}