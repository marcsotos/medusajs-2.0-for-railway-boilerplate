import { createClient } from "@sanity/client"

type SanityModuleOptions = {
  project_id: string
  dataset: string
  api_token?: string
  api_version?: string
  studio_url?: string
  type_map?: Record<string, string>
}

class SanityModuleService {
  private client
  private options: SanityModuleOptions

  constructor(_container: any, options: SanityModuleOptions) {
    this.options = {
      project_id: options?.project_id || process.env.SANITY_PROJECT_ID!,
      dataset: options?.dataset || process.env.SANITY_DATASET || "production",
      api_token: options?.api_token || process.env.SANITY_API_TOKEN,
      api_version:
        options?.api_version || process.env.SANITY_API_VERSION || "2024-01-01",
      studio_url: options?.studio_url || process.env.SANITY_STUDIO_URL,
      type_map: options?.type_map || { product: "product" },
    }

    this.client = createClient({
      projectId: this.options.project_id,
      dataset: this.options.dataset,
      token: this.options.api_token,
      apiVersion: this.options.api_version,
      useCdn: false,
    })
  }

  async ping() {
    await this.client.fetch(`count(*[])`)
    return true
  }

  async upsertSyncDocument(type: string, doc: Record<string, any>) {
    const medusaId = doc.medusaId
    if (!medusaId) throw new Error("upsertSyncDocument: falta medusaId")

    const sanityType = this.options.type_map?.[type] || type

    const existing = await this.client.fetch(
      `*[_type == $type && medusaId == $medusaId][0]`,
      { type: sanityType, medusaId }
    )

    const base = { _type: sanityType, medusaId, ...doc }

    if (existing?._id) {
      return await this.client.patch(existing._id).set(base).commit()
    }

    return await this.client.create({
      _id: `${sanityType}-${medusaId}`,
      ...base,
    })
  }

  async upsertProduct(product: {
    id: string
    title: string
    handle?: string
    description?: string
  }) {
    const payload = {
      medusaId: product.id,
      title: product.title,
      handle: product.handle ? { _type: "slug", current: product.handle } : undefined,
      description: product.description,
    }
    return this.upsertSyncDocument("product", payload)
  }
}

export default SanityModuleService
