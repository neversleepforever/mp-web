"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"

interface GalleryImage {
  asset?: { url: string }
  alt?: string
  credit?: string
}

export default function Gallery({
  images,
  title,
}: {
  images: GalleryImage[]
  title?: string
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const pathname = usePathname()
  const isFullGallery = pathname?.includes("/folio/gallery/") ?? false

  if (!images?.length) return null
  const selected = images[selectedIndex]

  // ✅ UseCallback for keyboard handler
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isFullGallery) return

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % images.length)
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
      }
    },
    [isFullGallery, images.length]
  )

  // ✅ Hook always runs — no conditionals
  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("keydown", handleKey)
    }
  }, [handleKey])

  return (
    <div className="w-full h-[85vh] flex flex-col lg:flex-row relative">
      {/* Main image */}
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        {selected?.asset?.url && (
          <figure className="relative w-full h-full flex flex-col justify-center">
            <Image
              src={selected.asset.url}
              alt={selected.alt || title || ""}
              fill
              className="object-contain"
              priority
            />
            {selected.credit && (
              <figcaption className="text-sm text-gray-500 mt-2 text-center relative z-10 bg-black/50 text-white">
                {selected.credit}
              </figcaption>
            )}
          </figure>
        )}
      </div>

      {/* Thumbnails */}
      <div
        className="
          flex justify-center overflow-x-auto px-2 pb-2
          lg:w-15 lg:h-full lg:overflow-y-auto lg:flex-col lg:px-0 lg:pb-0 lg:ml-7.5
        "
      >
        {images.map((img, i) =>
          img?.asset?.url ? (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative flex-shrink-0 overflow-hidden border 
                ${i === selectedIndex ? "border-blue-500" : "border-transparent"}
                h-20 w-auto lg:w-full lg:h-auto`}
            >
              <Image
                src={img.asset.url}
                alt={img.alt || title || ""}
                width={200}
                height={200}
                className="h-full w-auto lg:w-full lg:h-auto object-contain"
              />
            </button>
          ) : null
        )}
      </div>

      {/* Up/Down buttons only in full gallery */}
      {isFullGallery && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 text-white">
          <button
            onClick={() =>
              setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
            }
            className="uppercase text-xs hover:underline cursor-pointer"
          >
            UP
          </button>
          <button
            onClick={() =>
              setSelectedIndex((prev) => (prev + 1) % images.length)
            }
            className="uppercase text-xs hover:underline cursor-pointer"
          >
            DOWN
          </button>
        </div>
      )}
    </div>
  )
}
