"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="flex items-start relative w-full">
        <div className="flex flex-col w-full gap-y-4">
          <Container className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle flex items-center justify-center">
            <span className="text-ui-fg-subtle">No hay imágenes disponibles</span>
          </Container>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Imagen principal */}
      <Container className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle">
        {images[selectedImage]?.url && (
          <Image
            src={images[selectedImage].url}
            priority
            className="absolute inset-0 rounded-rounded"
            alt={`Imagen del producto ${selectedImage + 1}`}
            fill
            sizes="(max-width: 576px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 55vw, 55vw"
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </Container>

      {/* Thumbnails - Solo mostrar si hay más de 1 imagen */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-ui-fg-interactive"
                  : "border-ui-border-base hover:border-ui-border-interactive"
              }`}
            >
              {image.url && (
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery