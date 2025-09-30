type ProductGridSkeletonProps = {
  limit: number
}

export default function ProductGridSkeleton({ limit }: ProductGridSkeletonProps) {
  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
      data-testid="product-grid-skeleton"
    >
      {Array.from({ length: limit }).map((_, index) => (
        <div key={index} className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Imagen */}
          <div className="relative aspect-[4/5] bg-gray-200 animate-pulse" />
          
          {/* Contenido */}
          <div className="p-4">
            {/* Título */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            
            {/* Precio y badge */}
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
              {index < 2 && (
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
