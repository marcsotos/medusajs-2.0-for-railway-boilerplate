"use client"

import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { VariantGallery } from "@modules/products/components/variant-gallery"

import MobileActions from "./mobile-actions"
import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  onVariantChange?: (variant: HttpTypes.StoreProductVariant) => void
}

// Map variant options to a keymap by option title => value (simpler approach)
const optionsAsKeymap = (variantOptions: any) => {
  const list = Array.isArray(variantOptions) ? variantOptions : []
  return list.reduce((acc: Record<string, string | undefined>, varopt: any) => {
    const key = varopt?.option?.title || varopt?.option_title
    const value = varopt?.value
    if (key && (value ?? null) !== null && value !== undefined) {
      acc[String(key)] = String(value)
    }
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
  onVariantChange,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options (or none)
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions)
      return
    }

    // If there are multiple variants and no options selected yet, preselect a valid variant
    if ((product.variants?.length || 0) > 1 && Object.keys(options).length === 0) {
      const preferred =
        product.variants?.find((v) =>
          (!v.manage_inventory || v.allow_backorder || (v.inventory_quantity || 0) > 0)
        ) || product.variants?.[0]

      const variantOptions = optionsAsKeymap(preferred?.options)
      setOptions(variantOptions)
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    // Fallback: if there's exactly one variant and no product options, use it
    if (product.variants.length === 1 && (product.options?.length ?? 0) === 0) {
      return product.variants[0]
    }

    const variant = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })

    return variant
  }, [product.variants, product.options, options])

  // Notify parent about selected variant changes
  useEffect(() => {
    if (selectedVariant && onVariantChange) {
      onVariantChange(selectedVariant)
    }
  }, [selectedVariant, onVariantChange])

  // Initial notify on mount
  useEffect(() => {
    if (product.variants && product.variants.length > 0 && onVariantChange) {
      if (selectedVariant) {
        onVariantChange(selectedVariant)
      } else if (product.variants.length === 1) {
        onVariantChange(product.variants[0])
      } else {
        onVariantChange(product.variants[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // update the options when a variant option is selected
  const setOptionValue = (title: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [title]: value,
    }))
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    if (selectedVariant?.allow_backorder) {
      return true
    }
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity, // Usar la cantidad seleccionada
      countryCode,
    })

    setIsAdding(false)
  }

  // Funciones para manejar la cantidad
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.title ?? ""]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        {/* Variant-specific gallery if metadata images are present */}
        {selectedVariant ? (
          <VariantGallery variant={selectedVariant as any} />
        ) : null}

        {/* Selector de cantidad */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-gray-700">Cantidad:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-3 hover:bg-gray-50 transition-colors"
              disabled={quantity <= 1 || disabled || isAdding}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center border-none outline-none"
              min="1"
              disabled={disabled || isAdding}
            />
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-3 hover:bg-gray-50 transition-colors"
              disabled={disabled || isAdding}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant || !!disabled || isAdding}
          variant="primary"
          className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant ? (
            "Seleccionar variante"
          ) : !inStock ? (
            "Sin stock"
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Añadir al carrito
            </>
          )}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}