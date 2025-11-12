"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"

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
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  const goPrev = () =>
    setSelectedIndex((i) => (i - 1 + images.length) % images.length)

  const goNext = () =>
    setSelectedIndex((i) => (i + 1) % images.length)

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

  useEffect(() => {
  const mediaQuery = window.matchMedia("(min-width: 1280px)")

  if (!mediaQuery.matches) return 

  let scrollTimeout: NodeJS.Timeout | null = null
  let scrollAccumulated = 0
  const SCROLL_THRESHOLD = 20
  const COOLDOWN_MS = 200

  const handleWheel = (e: WheelEvent) => {
    scrollAccumulated += e.deltaY

    if (Math.abs(scrollAccumulated) > SCROLL_THRESHOLD) {
      if (scrollAccumulated > 0) goNext()
      else goPrev()

      scrollAccumulated = 0

      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        scrollAccumulated = 0
      }, COOLDOWN_MS)
    }
  }

  window.addEventListener("wheel", handleWheel, { passive: true })

  return () => {
    window.removeEventListener("wheel", handleWheel)
    if (scrollTimeout) clearTimeout(scrollTimeout)
  }
}, [images.length])

useEffect(() => {
  const container = containerRef.current
  if (!container) return

  const mediaQuery = window.matchMedia("(min-width: 1280px)")
  if (mediaQuery.matches) return 

  let scrollTimeout: NodeJS.Timeout | null = null

  const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2

      let closestIndex = 0
      let closestDistance = Infinity

      thumbnailRefs.current.forEach((thumb, i) => {
        if (!thumb) return
        const thumbRect = thumb.getBoundingClientRect()
        const thumbCenter = thumbRect.left + thumbRect.width / 2
        const distance = Math.abs(containerCenter - thumbCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      })

      setSelectedIndex(closestIndex)
    }, 80) 
  }

  container.addEventListener("scroll", handleScroll, { passive: true })
  return () => {
    container.removeEventListener("scroll", handleScroll)
    if (scrollTimeout) clearTimeout(scrollTimeout)
  }
}, [images.length])

  useEffect(() => {
    const container = containerRef.current
    const selectedThumb = thumbnailRefs.current[selectedIndex]
    if (container && selectedThumb) {
      const containerRect = container.getBoundingClientRect()
      const thumbRect = selectedThumb.getBoundingClientRect()

      const scrollAmount =
        thumbRect.left -
        containerRect.left -
        containerRect.width / 2 +
        thumbRect.width / 2

      container.scrollBy({
        left: scrollAmount,
        top: 0,
        behavior: "smooth",
      })
    }
  }, [selectedIndex])

  if (!images?.length) return null

  const selected = images[selectedIndex]

  return (
    <>
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row scrollbar-hide lg:gap-7.5 xl:pt-6 xl:h-[calc(100vh-4rem)]">
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
          ref={containerRef}
          className="
            flex overflow-x-auto overflow-visible snap-x pl-[50vw] pr-[50vw] scrollbar-hide
            lg:w-[59px] lg:h-full lg:overflow-y-auto lg:flex-col lg:px-0 lg:pb-0 lg:mx-0 lg:pt-0
          "
        >
          {images.map((img, i) =>
            img?.asset?.url ? (
              <button
                  key={i}
                ref={(el) => { thumbnailRefs.current[i] = el }}
                onClick={() => setSelectedIndex(i)}
                className={`relative flex-shrink-0 overflow-hidden outline-none
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
                  className="h-full w-auto lg:w-full lg:h-auto object-contain snap-center"
                />
              </button>
            ) : null
          )}
        </div>
      </div>
            
      <div className="
        hidden xl:fixed xl:bottom-0 xl:left-0 xl:right-0
        xl:h-16 xl:flex xl:flex-row xl:justify-between xl:z-50
        xl:items-center xl:px-8 xl:font-nav xl:pointer-events-none 
      ">
        <button
          type="button"
          onClick={goNext}
          className="pointer-events-auto text-[14px] cursor-pointer uppercase hover:underline"
        >
          Down
        </button>
        <button
          type="button"
          onClick={goPrev}
          className="pointer-events-auto text-[14px] cursor-pointer uppercase hover:underline"
        >
          Up
        </button>
      </div>
    </>
  )
}
