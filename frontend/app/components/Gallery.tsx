"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

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
  if (!images?.length) return null

  const selected = images[selectedIndex]

  const goUp = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goDown = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  // keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        goUp()
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        goDown()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // show controls only on full gallery path
  const isFullGallery = pathname?.includes("/folio/gallery/") && pathname?.endsWith("/full")

  return (
    <div className="w-full h-[85vh] flex flex-col lg:flex-row">
      {/* Main image fills remaining space */}
      <div className="flex-1 flex justify-center items-center overflow-hidden relative">
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

        {/* Up/Down buttons overlay (only on full gallery page) */}
        {isFullGallery && (
          <div className="absolute top-1/2 right-4 flex flex-col gap-2 -translate-y-1/2">
            <button
              onClick={goUp}
              className="uppercase text-sm hover:underline cursor-pointer"
            >
              UP
            </button>
            <button
              onClick={goDown}
              className="uppercase text-sm hover:underline cursor-pointer"
            >
              DOWN
            </button>
          </div>
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
                h-20 w-auto lg:w-full lg:h-auto
              `}
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
    </div>
  )
}
