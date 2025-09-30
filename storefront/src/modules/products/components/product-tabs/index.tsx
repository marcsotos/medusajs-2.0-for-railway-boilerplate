"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const ingredients =
    (product.metadata?.ingredients as string | undefined)?.trim() || null

  const tabs = [
    {
      label: "Detalles de producto",
      component: <ProductInfoTab product={product} />,
    },
    // 👇 añadimos solo si existen ingredientes
    ...(ingredients
      ? [
          {
            label: "Ingredientes",
            component: <IngredientsTab ingredients={ingredients} />,
          },
        ]
      : []),
    {
      label: "Envío y devoluciones",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full border-t border-gray-200 pt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalles de producto</h2>
      <Accordion type="multiple" defaultValue={["Detalles de producto"]}>
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
            className="border-b border-gray-200 last:border-b-0"
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-900">Descripción</span>
            <p className="text-gray-600 mt-1">
              {product.description || "Enjuague bucal para encías delicadas con acción antiséptica y protectora."}
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-900">Marca</span>
            <p className="text-gray-600 mt-1">{product.collection?.title || "Lacer"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-900">Formato</span>
            <p className="text-gray-600 mt-1">Botella - 1 litro</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-900">Peso</span>
            <p className="text-gray-600 mt-1">{product.weight ? `${product.weight} g` : "1000 ml"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-900">País de origen</span>
            <p className="text-gray-600 mt-1">{product.origin_country || "España"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-900">Uso recomendado</span>
            <p className="text-gray-600 mt-1">Uso diario después del cepillado</p>
          </div>
        </div>
      </div>
      
      {/* Información adicional específica para farmacia */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Información importante</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Mantener fuera del alcance de los niños</li>
          <li>• No ingerir</li>
          <li>• En caso de irritación, suspender su uso</li>
          <li>• Conservar en lugar fresco y seco</li>
        </ul>
      </div>
    </div>
  )
}

// 👇 Ahora IngredientsTab recibe solo la string ya validada
const IngredientsTab = ({ ingredients }: { ingredients: string }) => {
  return (
    <div className="text-small-regular py-8">
      <p className="whitespace-pre-line">{ingredients}</p>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FastDelivery />
          </div>
          <div>
            <span className="font-semibold text-gray-900">Envío rápido</span>
            <p className="text-gray-600 mt-1">
              Recibe tu pedido en 24-48 horas laborables. Envío gratis a partir de 49€.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Refresh />
          </div>
          <div>
            <span className="font-semibold text-gray-900">Devoluciones fáciles</span>
            <p className="text-gray-600 mt-1">
              Tienes 30 días para devolver tu producto. Proceso simple y sin complicaciones.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Back />
          </div>
          <div>
            <span className="font-semibold text-gray-900">Atención farmacéutica</span>
            <p className="text-gray-600 mt-1">
              Consulta con nuestros farmacéuticos cualquier duda sobre el producto.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
