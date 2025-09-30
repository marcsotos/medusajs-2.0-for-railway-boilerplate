import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { ProductGrid } from "@modules/home/components/product-grid"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

// 👇 Sanity helpers (ruta relativa desde src/app/[countryCode]/(main)/page.tsx)
// import { sanity, urlFor } from "../../../lib/sanity"

export const metadata: Metadata = {
  title: "Mono Banano - Productos Naturales y Saludables",
  description:
    "Descubre nuestra selección de productos orgánicos y naturales para tu bienestar. Envío gratis en pedidos superiores a 50€.",
}

// ✅ ISR: revalida esta página cada 60s
export const revalidate = 60

type SanityCard = {
  _id: string
  title?: string
  medusaId?: string
  slug?: string
  images?: { asset: any; alt?: string }[]
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)

  if (!collections || !region) return null

  // 👉 Traer algunos productos desde Sanity para portada (opcional) - Temporalmente deshabilitado
  let sanityProducts: SanityCard[] = []
  // try {
  //   sanityProducts = await sanity.fetch(
  //     `*[_type == "product"] | order(_updatedAt desc)[0..7]{
  //       _id,
  //       title,
  //       medusaId,
  //       "slug": handle.current,
  //       images[]{ asset->, alt }
  //     }`,
  //     {},
  //     // 🧠 Juega bien con el caché de Next (ISR)
  //     { next: { revalidate: 60 } }
  //   )
  // } catch {
  //   // Silenciamos error para no romper la home si Sanity falla
  //   sanityProducts = []
  // }

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Productos Destacados Grid */}
      <ProductGrid 
        countryCode={countryCode}
        limit={8}
        title="Productos Destacados"
        subtitle="Descubre nuestra selección cuidadosamente curada de productos más populares y mejor valorados por nuestros clientes"
        showViewAll={true}
      />

      {/* Featured Products Sections (Medusa) */}
      <div className="section-container bg-white">
        <div className="content-container">
          <ul className="flex flex-col gap-y-16">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      </div>

      {/* Bloque desde Sanity (opcional) */}
      {Array.isArray(sanityProducts) && sanityProducts.length > 0 && (
        <section className="bg-white py-12">
          <div className="content-container">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d3748] mb-6">
              Novedades del CMS
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {sanityProducts.map((p) => {
                const first = p.images?.[0]
                const href = p.slug
                  ? `/${countryCode}/products/${p.slug}`
                  : `/${countryCode}/main`

                const imgUrl = first?.asset
                  ? urlFor(first).width(600).height(600).fit("crop").url()
                  : "/placeholder.png" // Asegúrate de tener este asset en /public

                return (
                  <Link
                    key={p._id}
                    href={href}
                    prefetch={false}
                    className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition block"
                    aria-label={p.title || "Producto"}
                  >
                    <div className="w-full aspect-square relative">
                      <Image
                        src={imgUrl}
                        alt={first?.alt || p.title || "Producto"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {p.title || "Producto"}
                      </h3>
                      {p.medusaId && (
                        <p className="text-xs text-gray-500 mt-1">ID: {p.medusaId}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

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
              <h3 className="font-semibold text-lg text-[#2d3748] mb-2">100% Natural</h3>
              <p className="text-sm text-gray-600">
                Productos orgánicos sin químicos ni aditivos artificiales
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-semibold text-lg text-[#2d3748] mb-2">Envío Gratis</h3>
              <p className="text-sm text-gray-600">En pedidos superiores a 50€ a toda España</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="font-semibold text-lg text-[#2d3748] mb-2">Calidad Garantizada</h3>
              <p className="text-sm text-gray-600">Miles de clientes satisfechos nos respaldan</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
