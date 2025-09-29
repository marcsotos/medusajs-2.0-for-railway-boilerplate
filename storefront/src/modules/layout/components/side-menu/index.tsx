"use client"

import { Popover, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

const SideMenuItems = {
  Home: { href: "/", icon: "🏠", description: "Página principal" },
  Store: { href: "/store", icon: "🛍️", description: "Todos los productos" },
  Search: { href: "/search", icon: "🔍", description: "Buscar productos" },
  Account: { href: "/account", icon: "👤", description: "Mi cuenta" },
  Cart: { href: "/cart", icon: "🛒", description: "Carrito de compras" },
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-slate-900"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="w-5 h-0.5 bg-slate-600"></div>
                    <div className="w-5 h-0.5 bg-slate-600"></div>
                    <div className="w-5 h-0.5 bg-slate-600"></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-slate-700">
                    Menú
                  </span>
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
              >
                <Popover.Panel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm m-2">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-white rounded-lg shadow-xl border border-gray-200 justify-between p-6"
                  >
                    {/* Header del menú */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">MB</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900">Mono Banano</h3>
                          <p className="text-xs text-slate-600">Menú de navegación</p>
                        </div>
                      </div>
                      <button 
                        data-testid="close-menu-button" 
                        onClick={close}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      >
                        <XMark className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Items del menú */}
                    <ul className="flex flex-col gap-1 items-start justify-start flex-1">
                      {Object.entries(SideMenuItems).map(([name, item]) => {
                        return (
                          <li key={name} className="w-full">
                            <LocalizedClientLink
                              href={item.href}
                              className="flex items-center gap-3 w-full px-3 py-3 hover:bg-gray-50 rounded-md transition-colors duration-200"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              <span className="text-lg">
                                {item.icon}
                              </span>
                              <div className="flex flex-col">
                                <span className="text-base font-medium text-slate-900">
                                  {name}
                                </span>
                                <span className="text-sm text-slate-600">
                                  {item.description}
                                </span>
                              </div>
                              <div className="ml-auto">
                                <ArrowRightMini className="w-4 h-4 text-gray-400" />
                              </div>
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>

                    {/* Footer del menú */}
                    <div className="flex flex-col gap-y-4 mt-6 pt-4 border-t border-gray-200">
                      <div
                        className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors duration-200 cursor-pointer"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      
                      <div className="text-center">
                        <Text className="text-xs text-gray-500">
                          © {new Date().getFullYear()} Mono Banano. Todos los derechos reservados.
                        </Text>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
