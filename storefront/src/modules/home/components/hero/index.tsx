import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <>
      {/* Banner promocional superior */}
      <div className="w-full bg-[#1a1f3a] text-white text-center py-2 text-sm font-medium">
        🍌 Envío gratis en pedidos superiores a 50€
      </div>

      {/* Hero principal con slider */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-[#fef5e7] to-[#fff9e6] overflow-hidden">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
            
            {/* Contenido de texto */}
            <div className="flex flex-col justify-center space-y-6 z-10">
              <Heading
                level="h1"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2d3748] leading-tight"
              >
                ¡Productos naturales para tu bienestar!
              </Heading>
              
              <p className="text-lg md:text-xl text-[#4a5568] font-light">
                Descubre nuestra selección de productos orgánicos y saludables
              </p>

              <div className="flex gap-4 items-center">
                <Button 
                  size="large"
                  className="bg-[#2d3748] hover:bg-[#1a202c] text-white px-8 py-3 rounded-md font-medium transition-colors"
                >
                  Comprar ahora
                </Button>
                
                <span className="text-sm text-[#718096]">
                  Hasta <strong className="text-[#2d3748]">-40%</strong> de descuento
                </span>
              </div>
            </div>

            {/* Imagen del producto */}
            <div className="relative hidden md:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                {/* Círculo decorativo de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#fff5cc] to-[#ffe6a3] rounded-full transform scale-90 opacity-50 blur-3xl"></div>
                
                {/* Aquí irá tu imagen de producto */}
                <div className="relative z-10 flex justify-center items-center h-[350px]">
                  <div className="bg-white rounded-full w-64 h-64 shadow-2xl flex items-center justify-center">
                    <span className="text-6xl">🍌</span>
                  </div>
                </div>

                {/* Badge de descuento flotante */}
                <div className="absolute top-10 right-10 bg-[#ffeb3b] text-[#2d3748] rounded-full w-20 h-20 flex items-center justify-center font-bold text-lg shadow-lg transform rotate-12">
                  -40%
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores del slider */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            <button className="w-2 h-2 rounded-full bg-[#2d3748]"></button>
            <button className="w-2 h-2 rounded-full bg-gray-300"></button>
            <button className="w-2 h-2 rounded-full bg-gray-300"></button>
          </div>
        </div>

        {/* Flechas de navegación */}
        <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-shadow z-20">
          <svg className="w-6 h-6 text-[#2d3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-shadow z-20">
          <svg className="w-6 h-6 text-[#2d3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Sección de promociones rápidas */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-[#e8f5e9] rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer">
            <div>
              <p className="text-sm text-[#2e7d32] font-medium mb-1">30% dto. en 2ª ud.</p>
              <Button variant="transparent" className="text-[#2e7d32] underline p-0 h-auto font-semibold">
                Comprar
              </Button>
            </div>
            <div className="text-5xl">🥗</div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#e3f2fd] rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer">
            <div>
              <p className="text-sm text-[#1565c0] font-medium mb-1">Consejo farmacéutico</p>
              <Button variant="transparent" className="text-[#1565c0] underline p-0 h-auto font-semibold">
                Consultar
              </Button>
            </div>
            <div className="text-5xl">💊</div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#fff3e0] rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer">
            <div>
              <p className="text-sm text-[#e65100] font-medium mb-1">20% dto.</p>
              <Button variant="transparent" className="text-[#e65100] underline p-0 h-auto font-semibold">
                Comprar
              </Button>
            </div>
            <div className="text-5xl">🧴</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero