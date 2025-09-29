import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* Banner Promocional Profesional */}
      <div className="bg-slate-900 text-white text-center py-2 text-sm font-medium">
        <div className="content-container">
          Envío gratuito en pedidos superiores a 50€ • Atención al cliente 24/7
        </div>
      </div>

      {/* Header Principal Profesional */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <nav className="content-container flex items-center justify-between w-full h-16">
          {/* Logo y Menu Mobile - Izquierda */}
          <div className="flex items-center gap-6 flex-1 basis-0">
            <div className="h-full flex items-center">
              <SideMenu regions={regions} />
            </div>
            
            {/* Logo Profesional */}
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200"
              data-testid="nav-store-link"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MB</span>
                </div>
                <div className="ml-3 hidden sm:block">
                  <span className="block text-lg font-semibold text-slate-900 leading-tight">
                    Mono Banano
                  </span>
                  <span className="block text-xs text-slate-600 leading-tight">
                    Productos Naturales
                  </span>
                </div>
              </div>
            </LocalizedClientLink>
          </div>

          {/* Barra de Búsqueda Profesional - Centro (Desktop) */}
          {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <LocalizedClientLink
                href="/search"
                scroll={false}
                data-testid="nav-search-link"
                className="w-full"
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm bg-white"
                    readOnly
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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

          {/* Acciones Profesionales - Derecha */}
          <div className="flex items-center gap-4 flex-1 basis-0 justify-end">
            {/* Búsqueda Mobile */}
            {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
              <LocalizedClientLink
                className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                href="/search"
                scroll={false}
                data-testid="nav-search-link-mobile"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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

            {/* Soporte */}
            <LocalizedClientLink
              className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
              href="/support"
              data-testid="nav-support-link"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="hidden lg:inline text-sm text-gray-700">Ayuda</span>
            </LocalizedClientLink>

            {/* Account */}
            <LocalizedClientLink
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
              href="/account"
              data-testid="nav-account-link"
            >
              <svg
                className="w-5 h-5 text-gray-600"
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
              <span className="hidden lg:inline text-sm text-gray-700">Cuenta</span>
            </LocalizedClientLink>

            {/* Cart */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 relative"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
                  <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    0
                  </span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        {/* Barra de Navegación Secundaria Profesional - Desktop */}
        <div className="hidden lg:block border-t border-gray-200 bg-gray-50">
          <div className="content-container">
            <div className="flex items-center justify-center gap-8 py-3 text-sm">
              <LocalizedClientLink
                href="/store"
                className="px-4 py-2 text-gray-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors duration-200 font-medium"
              >
                Productos
              </LocalizedClientLink>
              
              <LocalizedClientLink
                href="/collections"
                className="px-4 py-2 text-gray-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors duration-200 font-medium"
              >
                Colecciones
              </LocalizedClientLink>
              
              <LocalizedClientLink
                href="/offers"
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 font-medium"
              >
                Ofertas
              </LocalizedClientLink>
              
              <LocalizedClientLink
                href="/about"
                className="px-4 py-2 text-gray-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors duration-200 font-medium"
              >
                Sobre Nosotros
              </LocalizedClientLink>
              
              <LocalizedClientLink
                href="/blog"
                className="px-4 py-2 text-gray-700 hover:text-slate-900 hover:bg-white rounded-md transition-colors duration-200 font-medium"
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