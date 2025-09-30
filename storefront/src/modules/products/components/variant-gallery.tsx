export type VariantMetaImg = { url: string }

export type VariantLike = {
  id: string
  title?: string | null
  metadata?: {
    thumbnail?: string | null
    images?: VariantMetaImg[] | null
  } | null
}

export function VariantGallery({ variant }: { variant: VariantLike }) {
  const thumb = variant.metadata?.thumbnail ?? null
  const images = variant.metadata?.images ?? []

  if (!thumb && (!images || images.length === 0)) return null

  return (
    <div className="space-y-3">
      {thumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb}
          alt={`${variant.title ?? "Variant"} thumbnail`}
          className="w-full max-w-sm rounded"
          loading="lazy"
        />
      )}

      {images?.length ? (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${variant.id}-${i}`}
              src={img.url}
              alt={`${variant.title ?? "Variant"} image ${i + 1}`}
              className="w-full rounded"
              loading="lazy"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
