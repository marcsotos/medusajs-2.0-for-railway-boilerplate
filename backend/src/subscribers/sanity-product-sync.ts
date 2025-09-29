import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import type { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

// Escucha creaciones/actualizaciones de productos y los sube/actualiza en Sanity
export default async function sanityProductSync({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productService = container.resolve<IProductModuleService>(Modules.PRODUCT)
  const sanity = container.resolve<any>("sanity") // nuestro módulo local

  // Recupera el producto completo (ajusta relaciones si quieres más info)
  const product = await productService.retrieveProduct(data.id, {
    relations: ["variants", "images", "categories", "collection"],
  })

  // Upsert en Sanity
  await sanity.upsertProduct({
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
  })

  console.log(`[Sanity] Sincronizado producto: ${product.title} (${product.id})`)
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
}
