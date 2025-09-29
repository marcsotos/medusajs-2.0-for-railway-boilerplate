export const productByMedusaId = `
*[_type == "product" && medusaId == $medusaId][0]{
  title,
  description,
  "slug": handle.current,
  images[]{asset->, alt},
  seoTitle,
  seoDescription,
  additionalContent,
  features
}`

export const homePage = `
*[_type == "home"][0]{
  title,
  description,
  hero{
    heading,
    subheading,
    image{asset->},
    ctaLabel,
    ctaHref
  }
}`
