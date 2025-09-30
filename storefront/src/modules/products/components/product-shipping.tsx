const ProductShipping = () => {
  return (
    <div className="space-y-4 py-4">
      {/* Información de envío */}
      <div className="flex items-center gap-3 text-sm">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="text-gray-700">Recíbelo el Jueves</span>
      </div>

      {/* Envío gratis */}
      <div className="flex items-center gap-3 text-sm">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
        </svg>
        <span className="text-gray-700">Envío gratis a partir de 49€</span>
      </div>

      {/* Devoluciones gratis */}
      <div className="flex items-center gap-3 text-sm">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-gray-700">Devoluciones gratis</span>
      </div>

      {/* Pago seguro */}
      <div className="flex items-center gap-3 text-sm">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-gray-700">Pago seguro</span>
      </div>
    </div>
  )
}

export default ProductShipping