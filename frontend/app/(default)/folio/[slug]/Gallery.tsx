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
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 flex justify-center items-end overflow-hidden">
        {selected?.asset?.url && (
          <figure className="relative w-full h-full max-w-6xl flex flex-col justify-end">
            <div className="relative w-full h-full flex items-end">
              <Image
                src={selected.asset.url}
                alt={selected.alt || title || ""}
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
            {selected.credit && (
              <figcaption className="text-sm text-gray-500 mt-2 text-center relative z-10 bg-black/50 text-white">
                {selected.credit}
              </figcaption>
            )}
          </figure>
        )}
      </div>

      <div className="h-24 overflow-x-scroll border-t border-gray-200">
        <div className="flex gap-0 items-center h-full">
          {images.map((img, i) =>
            img?.asset?.url ? (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`relative w-24 h-24 flex-shrink-0 overflow-hidden ${
                  i === selectedIndex ? "border-blue-500" : "border-transparent"
                }`}
                aria-label={`Select image ${i + 1}`}
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
    </div>
  )
}
