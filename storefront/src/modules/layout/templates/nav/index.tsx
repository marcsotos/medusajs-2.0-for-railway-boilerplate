import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Banner Promocional Superior */}
      <div className="promo-banner">
        🍌 Envío gratis en pedidos superiores a 50€
      </div>

      {/* Header Principal */}
      <header className="relative mx-auto duration-200 bg-white border-b border-ui-border-base shadow-sm">
        <nav className="content-container flex items-center justify-between w-full h-16 sm:h-20">
          {/* Logo y Menu Mobile - Izquierda */}
          <div className="flex items-center gap-4 flex-1 basis-0">
            <div className="h-full flex items-center">
              <SideMenu regions={regions} />
            </div>
            
            {/* Logo */}
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl">🍌</span>
                <div className="ml-2 hidden sm:block">
                  <span className="block text-lg font-bold text-[#2d3748] leading-tight">
                    Mono Banano
                  </span>
                  <span className="block text-xs text-gray-500 leading-tight">
                    Natural & Saludable
                  </span>
                </div>
              </div>
            </LocalizedClientLink>
          </div>

          {/* Barra de Búsqueda - Centro (Desktop) */}
          {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <LocalizedClientLink
                href="/search"
                scroll={false}
                data-testid="nav-search-link"
                className="w-full"
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="¿Qué estás buscando?"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2d3748] focus:border-transparent text-sm"
                    readOnly
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </LocalizedClientLink>
            </div>
          )}

          {/* Acciones - Derecha */}
          <div className="flex items-center gap-3 sm:gap-6 flex-1 basis-0 justify-end">
            {/* Búsqueda Mobile */}
            {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
              <LocalizedClientLink
                className="md:hidden hover:text-[#2d3748] transition-colors"
                href="/search"
                scroll={false}
                data-testid="nav-search-link-mobile"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </LocalizedClientLink>
            )}

            {/* Soporte/Ayuda */}
            <LocalizedClientLink
              className="hidden sm:flex items-center gap-1 hover:text-[#2d3748] transition-colors text-sm"
              href="/support"
              data-testid="nav-support-link"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="hidden lg:inline">Ayuda</span>
            </LocalizedClientLink>

            {/* Account */}
            <LocalizedClientLink
              className="flex items-center gap-1 hover:text-[#2d3748] transition-colors text-sm"
              href="/account"
              data-testid="nav-account-link"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden lg:inline">Cuenta</span>
            </LocalizedClientLink>

            {/* Cart */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center gap-1 hover:text-[#2d3748] transition-colors relative"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-[#2d3748] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    0
                  </span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        {/* Barra de Navegación Secundaria - Desktop */}
        <div className="hidden lg:block border-t border-gray-100">
          <div className="content-container">
            <div className="flex items-center justify-center gap-8 py-3 text-sm">
              <LocalizedClientLink
                href="/store"
                className="hover:text-[#2d3748] transition-colors font-medium"
              >
                Productos
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/collections"
                className="hover:text-[#2d3748] transition-colors font-medium"
              >
                Colecciones
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/offers"
                className="hover:text-[#2d3748] transition-colors font-medium text-[#e65100]"
              >
                🔥 Ofertas
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/about"
                className="hover:text-[#2d3748] transition-colors font-medium"
              >
                Sobre Nosotros
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/blog"
                className="hover:text-[#2d3748] transition-colors font-medium"
              >
                Blog
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}