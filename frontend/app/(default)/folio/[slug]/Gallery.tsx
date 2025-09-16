"use client"

import { useState } from "react"
import Image from "next/image"

interface GalleryImage {
  asset?: { url: string }
  alt?: string
  credit?: string
}

export default function Gallery({ images, title }: { images: GalleryImage[]; title?: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images?.length) return null

  const selected = images[selectedIndex]

  return (
    <div className="w-full">
      {selected?.asset?.url && (
        <div className="mb-6">
          <Image
            src={selected.asset.url}
            alt={selected.alt || title || ""}
            width={1200}
            height={800}
            className="w-screen h-auto"
          />
          {selected.credit && (
            <figcaption className="text-sm text-gray-500 mt-2 text-center">
              {selected.credit}
            </figcaption>
          )}
        </div>
      )}

      <div className="flex flex-wrap">
        {images.map((img, i) =>
          img?.asset?.url ? (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-24 h-24 flex-shrink-0 overflow-hidden ${
                i === selectedIndex ? "border-blue-500" : "border-transparent"
              }`}
            >
              <Image
                src={img.asset.url}
                alt={img.alt || title || ""}
                fill
                className="object-cover"
              />
            </button>
          ) : null
        )}
      </div>
    </div>
  )
}
