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
    <div className="w-full h-[85vh] flex flex-col">
      <div className="flex-1 flex justify-center mb-6 items-end overflow-hidden">
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

    <div className="-mx-6"> {/* pulls it outside the parent padding */}
        <div className="flex gap-0 overflow-x-auto px-6 pb-2 scrollbar-hide">
            {images.map((img, i) =>
            img?.asset?.url ? (
                <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`relative h-24 flex-shrink-0 overflow-hidden ${
                    i === selectedIndex ? "border-blue-500" : "border-transparent"
                }`}
                >
                <Image
                    src={img.asset.url}
                    alt={img.alt || title || ""}
                    height={96}
                    width={2000} 
                    className="h-full w-auto object-contain"
                />
                </button>
            ) : null
            )}
        </div>
        </div>

    </div>
  )
}
