"use client"

import { InstantSearch } from "react-instantsearch-hooks-web"
import { useRouter } from "next/navigation"

import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import Hit from "@modules/search/components/hit"
import Hits from "@modules/search/components/hits"
import SearchBox from "@modules/search/components/search-box"
import { useEffect, useRef } from "react"

export default function SearchModal() {
  const router = useRouter()
  const searchRef = useRef(null)

  // Close modal on outside click
  const handleOutsideClick = (event: MouseEvent) => {
    if (event.target === searchRef.current) {
      router.back()
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick)
    return () => {
      window.removeEventListener("click", handleOutsideClick)
    }
  }, [])

  // Disable scroll on body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [router])

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="relative z-[75]">
      {/* Overlay mejorado */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
      
      {/* Container del modal */}
      <div className="fixed inset-0 px-4 sm:px-0 flex items-start justify-center pt-16 sm:pt-24" ref={searchRef}>
        <div className="relative w-full max-w-3xl">
          <InstantSearch
            indexName={SEARCH_INDEX_NAME}
            searchClient={searchClient}
          >
            <div
              className="flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden animate-fadeIn"
              data-testid="search-modal-container"
            >
              {/* Header con barra de búsqueda */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <svg 
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
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
                <div className="flex-1">
                  <SearchBox />
                </div>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Cerrar búsqueda"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Resultados */}
              <div className="max-h-[60vh] overflow-y-auto">
                <Hits hitComponent={Hit} />
              </div>

              {/* Footer con sugerencia (opcional) */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  Presiona <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold">ESC</kbd> para cerrar
                </p>
              </div>
            </div>
          </InstantSearch>
        </div>
      </div>
    </div>
  )
}