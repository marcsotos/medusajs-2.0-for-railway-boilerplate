import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
})

const builder = imageUrlBuilder(sanity)
export const urlFor = (src: any) => builder.image(src)
