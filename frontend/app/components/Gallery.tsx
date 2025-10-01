"use client"

import { useState /*, useEffect */ } from "react"
import Image from "next/image"

interface GalleryImage {
  asset?: { url: string }
  alt?: string
  credit?: string
}

type Props = {
  images: GalleryImage[]
  title?: string
  // enableKeyboard?: boolean      // commented for now
  // showControls?: boolean        // commented for now
}

export default function Gallery({
  images,
  title,
  // enableKeyboard = false,
  // showControls = false,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  if (!images?.length) return null

  // 🔒 Temporarily removed keyboard navigation hook
  /*
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!enableKeyboard) return
      const key = e.key.toLowerCase()
      if (key === "arrowup" || key === "arrowleft") {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + images.length) % images.length)
      } else if (key === "arrowdown" || key === "arrowright") {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % images.length)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [enableKeyboard, images.length])
  */

  const selected = images[selectedIndex]

  return (
    <div className="relative w-full h-[85vh] flex flex-col lg:flex-row">
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
                h-20 w-auto lg:w-full lg:h-auto
              `}
              aria-label={`Select image ${i + 1}`}
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

      {/* Controls commented out for now */}
      {/*
      {showControls && (
        <div className="pointer-events-none absolute right-3 bottom-3 flex flex-col gap-2 lg:right-28 lg:bottom-4">
          <button
            type="button"
            onClick={goPrev}
            className="pointer-events-auto text-xs uppercase underline decoration-1 hover:decoration-2"
          >
            Up
          </button>
          <button
            type="button"
            onClick={goNext}
            className="pointer-events-auto text-xs uppercase underline decoration-1 hover:decoration-2"
          >
            Down
          </button>
        </div>
      )}
      */}
    </div>
  )
}
