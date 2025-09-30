"use client"

import { Button, Heading } from "@medusajs/ui"
import { useState, useEffect } from "react"

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Datos de los slides
  const slides = [
    {
      id: 1,
      title: "¡Productos naturales para tu bienestar!",
      subtitle: "Descubre nuestra selección de productos orgánicos y saludables",
      cta: "Comprar ahora",
      discount: "-40%",
      emoji: "🍌",
      bgClass: "gradient-primary",
      badgeClass: "bg-[#ffeb3b] text-[#2d3748]",
      buttonClass: "btn-primary"
    },
    {
      id: 2,
      title: "Suplementos de calidad premium",
      subtitle: "Nutrición avanzada para tu salud y rendimiento",
      cta: "Ver productos",
      discount: "-25%",
      emoji: "💊",
      bgClass: "gradient-green",
      badgeClass: "bg-[#4caf50] text-white",
      buttonClass: "btn-primary"
    }
  ]

  // Auto-play del slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Cambia cada 5 segundos

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <>
      {/* Banner promocional superior */}
      <div className="w-full bg-[#1a1f3a] text-white text-center py-2 text-sm font-medium">
        🍌 Envío gratis en pedidos superiores a 50€
      </div>

      {/* Hero principal con slider */}
      <div className={`relative w-full h-[400px] md:h-[500px] ${currentSlideData.bgClass} overflow-hidden smooth-transition`}>
        <div className="content-container h-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
            
            {/* Contenido de texto */}
            <div className="flex flex-col justify-center space-y-6 z-10">
              <Heading
                level="h1"
                className="heading-hero smooth-transition"
              >
                {currentSlideData.title}
              </Heading>
              
              <p className="text-large-regular text-[#4a5568] smooth-transition">
                {currentSlideData.subtitle}
              </p>

              <div className="flex gap-4 items-center">
                <Button 
                  size="large"
                  className={`${currentSlideData.buttonClass} smooth-transition`}
                >
                  {currentSlideData.cta}
                </Button>
                
                <span className="text-small-regular text-[#718096]">
                  Hasta <strong className="text-[#2d3748]">{currentSlideData.discount}</strong> de descuento
                </span>
              </div>
            </div>

            {/* Imagen del producto */}
            <div className="relative hidden md:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                {/* Círculo decorativo de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#fff5cc] to-[#ffe6a3] rounded-full transform scale-90 opacity-50 blur-3xl smooth-transition"></div>
                
                {/* Imagen de producto */}
                <div className="relative z-10 flex justify-center items-center h-[350px]">
                  <div className="bg-white rounded-full w-64 h-64 shadow-card flex items-center justify-center smooth-transition hover-lift">
                    <span className="text-6xl smooth-transition">{currentSlideData.emoji}</span>
                  </div>
                </div>

                {/* Badge de descuento flotante */}
                <div className={`absolute top-10 right-10 ${currentSlideData.badgeClass} rounded-full w-20 h-20 flex items-center justify-center font-bold text-lg shadow-card transform rotate-12 smooth-transition`}>
                  {currentSlideData.discount}
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores del slider */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button 
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full smooth-transition ${
                  index === currentSlide 
                    ? 'bg-[#2d3748] scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Flechas de navegación */}
        <button 
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-card hover:shadow-lg smooth-transition z-20 hover-lift"
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6 text-[#2d3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-card hover:shadow-lg smooth-transition z-20 hover-lift"
          aria-label="Slide siguiente"
        >
          <svg className="w-6 h-6 text-[#2d3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Sección de promociones rápidas */}
      <div className="content-container py-8">
        <div className="grid-promo">
          {/* Card 1 */}
          <div className="promo-card gradient-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small-semi text-[#2e7d32] mb-1">30% dto. en 2ª ud.</p>
                <Button variant="transparent" className="link-underline text-[#2e7d32] p-0 h-auto font-semibold">
                  Comprar
                </Button>
              </div>
              <div className="text-5xl">🥗</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="promo-card gradient-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small-semi text-[#1565c0] mb-1">Consejo farmacéutico</p>
                <Button variant="transparent" className="link-underline text-[#1565c0] p-0 h-auto font-semibold">
                  Consultar
                </Button>
              </div>
              <div className="text-5xl">💊</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="promo-card gradient-orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small-semi text-[#e65100] mb-1">20% dto.</p>
                <Button variant="transparent" className="link-underline text-[#e65100] p-0 h-auto font-semibold">
                  Comprar
                </Button>
              </div>
              <div className="text-5xl">🧴</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero