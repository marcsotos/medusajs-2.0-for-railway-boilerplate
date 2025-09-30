import { HttpTypes } from "@medusajs/types"

interface ProductFeaturesProps {
  product: HttpTypes.StoreProduct
}

const ProductFeatures = ({ product }: ProductFeaturesProps) => {
  return (
    <div className="space-y-4">
      {/* Descripción del producto si existe */}
      {product.description && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Características adicionales simuladas */}
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Características</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• Formato de 1 litro</li>
          <li>• Enjuague bucal</li>
          <li>• Para encías delicadas</li>
          <li>• Uso diario recomendado</li>
        </ul>
      </div>
    </div>
  )
}

export default ProductFeatures