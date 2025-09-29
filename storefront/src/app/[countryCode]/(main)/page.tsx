import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Mono Banano - Productos Naturales y Saludables",
  description:
    "Descubre nuestra selección de productos orgánicos y naturales para tu bienestar. Envío gratis en pedidos superiores a 50€.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)

  if (!collections || !region) {
    return null
  }

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Sections */}
      <div className="section-container bg-white">
        <div className="content-container">
          <ul className="flex flex-col gap-y-16">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      </div>

      {/* Banner Promocional Adicional (Opcional) */}
      <div className="bg-gradient-to-r from-[#fef5e7] to-[#fff9e6] py-12">
        <div className="content-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2d3748] mb-4">
            ¿Por qué elegir Mono Banano?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="font-semibold text-lg text-[#2d3748] mb-2">
                100% Natural
              </h3>
              <p className="text-sm text-gray-600">
                Productos orgánicos sin químicos ni aditivos artificiales
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-semibold text-lg text-[#2d3748] mb-2">
                Envío Gratis
              </h3>
              <p className="text-sm text-gray-600">
                En pedidos superiores a 50€ a toda España
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="font-semibold text-lg text-[#2d3748] mb-2">
                Calidad Garantizada
              </h3>
              <p className="text-sm text-gray-600">
                Miles de clientes satisfechos nos respaldan
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}