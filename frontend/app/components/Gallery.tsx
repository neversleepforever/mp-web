"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface GalleryImage {
  asset?: { url: string }
  alt?: string
  credit?: string
}

type Props = {
  images: GalleryImage[]
  title?: string
  enableKeyboard?: boolean
  showControls?: boolean
}

export default function Gallery({
  images,
  title,
  enableKeyboard = true,
  showControls = false,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const pathname = usePathname()
  if (!images?.length) return null
  
  const isFullGallery = pathname?.endsWith("/full")
  const basePath = pathname?.endsWith("/full")
    ? pathname.replace(/\/full$/, "")
    : pathname

  useEffect(() => {
    if (!enableKeyboard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === "arrowup" || key === "arrowleft") {
        e.preventDefault()
        goPrev()
      } else if (key === "arrowdown" || key === "arrowright") {
        e.preventDefault()
        goNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enableKeyboard, images.length])

  const selected = images[selectedIndex]
 
  const goPrev = () =>
    setSelectedIndex((i) => (i - 1 + images.length) % images.length)

  const goNext = () =>
    setSelectedIndex((i) => (i + 1) % images.length)

  return (
    <>
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row scrollbar-hide lg:gap-7.5 xl:pt-6 xl:h-[calc(100vh-3rem)]">
      <div className="flex-1 flex justify-center items-end lg:items-center overflow-hidden scrollbar-hide pt-12 p-6 md:px-20 lg:p-0">
        {selected?.asset?.url && (
          <figure className="relative w-full h-full flex flex-col justify-end lg:justify-center">
            <Image
              src={selected.asset.url}
              alt={selected.alt || title || ""}
              fill
              className="object-contain object-bottom lg:object-top xl:object-center"
              priority
            />
            {selected.credit && (
              <figcaption className="text-sm text-gray-500 mt-2 text-center relative bg-black/50 text-white">
                {selected.credit}
              </figcaption>
            )}
          </figure>
        )}
      </div>
      <div
        className="
          flex overflow-x-auto overflow-visible pl-6 pr-6 md:pl-20 md:pr-20 scrollbar-hide
          lg:w-[59px] lg:h-full lg:overflow-y-auto lg:flex-col lg:px-0 lg:pb-0 lg:mx-0 lg:pt-0
        "
      >
        {images.map((img, i) =>
          img?.asset?.url ? (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative flex-shrink-0 overflow-hidden border 
                ${i === selectedIndex ? "border-black" : "border-transparent"}
                ${i === images.length - 1 ? "lg:mb-12" : ""} 
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
      
    </div>
    <div className="hidden xl:h-12 xl:w-full xl:flex xl:flex-row xl:justify-between xl:font-nav uppercase">
      <button    
        type="button"
        onClick={goNext} 
        className="pointer-events-auto uppercase text-[14px] self-start cursor-pointer hover:underline">Down</button>
      <button   
        type="button"
        onClick={goPrev} 
        className="pointer-events-auto uppercase text-[14px] self-start cursor-pointer hover:underline">Up</button>
    </div>
    </>
  )
}
