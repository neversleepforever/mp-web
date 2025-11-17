"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/imageBuilder"

export interface GalleryImage {
  asset: {
    _id: string
    metadata?: {
      lqip?: string
      dimensions?: {
        width: number
        height: number
      }
    }
  }
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
  const [loaded, setLoaded] = useState<boolean[]>(() =>
    new Array(images.length).fill(false)
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
    const mainImageRef = useRef<HTMLDivElement>(null)

  const goPrev = () =>
    setSelectedIndex((i) => (i - 1 + images.length) % images.length)

  const goNext = () =>
    setSelectedIndex((i) => (i + 1) % images.length)

  const handleLoad = (index: number) => {
  setLoaded((prev) => {
    const updated = [...prev]
    updated[index] = true
    return updated
  })
}
  const hideArrows = pathname.includes("/journal")
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

  const container = mainImageRef.current
  if (!container) return

  let scrollTimeout: NodeJS.Timeout | null = null
  let scrollAccumulated = 0
  const SCROLL_THRESHOLD = 20
  const COOLDOWN_MS = 200

  const handleWheel = (e: WheelEvent) => {
    // Ignore scrolling outside the gallery container
    if (!container.contains(e.target as Node)) return

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
}, [images.length, selectedIndex])


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

  // useEffect(() => {
  //   const container = containerRef.current
  //   const selectedThumb = thumbnailRefs.current[selectedIndex]
  //   if (container && selectedThumb) {
  //     const containerRect = container.getBoundingClientRect()
  //     const thumbRect = selectedThumb.getBoundingClientRect()

  //     const scrollAmount =
  //       thumbRect.left -
  //       containerRect.left -
  //       containerRect.width / 2 +
  //       thumbRect.width / 2

  //     container.scrollBy({
  //       left: scrollAmount,
  //       top: 0,
  //       behavior: "smooth",
  //     })
  //   }
  // }, [selectedIndex])

    useEffect(() => {
    if (!images?.length) return;

    images.forEach((img) => {
      if (!img?.asset) return;
      const preload = new window.Image();
      preload.src = urlFor(img.asset)
        .width(1600)   
        .quality(60)
        .fit("max")
        .url();
    });
  }, [images]);

  if (!images?.length) return null

  const selected = images[selectedIndex]


  return (
    <>
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row bar-hide lg:gap-7.5 xl:pt-6 xl:h-[calc(100vh-4rem)]">
      <div ref={mainImageRef} className="flex-1 flex justify-center items-end lg:items-center overflow-hidden scrollbar-hide pt-12 p-6 md:px-20 lg:p-0">
        <figure className="relative w-full h-full">
            {images.map((img, i) => {
              const fullSrc = urlFor(img.asset).width(1600).quality(60).url()
              const blurSrc = img.asset.metadata?.lqip

              return (
                <div
                  key={i}
                  className={`
                    absolute inset-0 
                    ${i === selectedIndex ? "opacity-100" : "opacity-0"}
                  `}
                >
                  {/* Blur layer */}
                  {/* <img
                    src={blurSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain overflow-hidden"
                    draggable={false}
                  /> */}

                  {/* Full-res layer */}
                  <img
                    src={fullSrc}
                    alt={img.alt || title || ""}
                    onLoad={() => handleLoad(i)}
                    className={`
                      absolute inset-0 w-full h-full object-contain transition-opacity duration-300
                      
                      ${i === selectedIndex ? "opacity-100" : "opacity-0"}
                    `}
                    draggable={false}
                  />
                </div>
              )
            })}
      </figure>
      </div>
      <div
          ref={containerRef}
          className="
            flex overflow-x-auto overflow-visible snap-x pl-[50vw] pr-[50vw] scrollbar-hide snap-x snap-mandatory
            lg:w-[59px] lg:h-full lg:overflow-y-auto lg:flex-col lg:px-0 lg:pb-0 lg:mx-0 lg:pt-0
          "
        >
          {images.map((img, i) =>
            img?.asset ? (
              <button
                key={i}
                ref={(el) => { thumbnailRefs.current[i] = el }}
                onClick={() => setSelectedIndex(i)}
                className={`
                  relative snap-center flex-shrink-0 overflow-hidden
                  h-20 w-auto lg:w-full lg:h-auto
                  ${i === images.length - 1 ? "lg:mb-12" : ""}
                  ${i === selectedIndex
                    ? "outline outline-2 outline-white outline-offset-[-2px]"
                    : "outline-none"
                  }
                `}
                aria-label={`Select image ${i + 1}`}
              >
              <Image
                src={urlFor(img.asset)
                  .width(400)
                  .auto("format")
                  .quality(75)
                  .url()}
                alt={img.alt || title || ""}
                width={img.asset.metadata?.dimensions?.width || 400}
                height={img.asset.metadata?.dimensions?.height || 400}
                placeholder="blur"
                blurDataURL={img.asset.metadata?.lqip}
                className="h-full w-auto lg:w-full lg:h-auto object-contain snap-center"
              />
            </button>
            ) : null
          )}
        </div>
      </div>
    {!hideArrows && (
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
      </div> )}
    </>
  )
}
