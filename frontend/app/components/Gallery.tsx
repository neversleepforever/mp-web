"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/imageBuilder"
import TextDistortFilter from "./TextFilter"

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
  const [selectedByTap, setSelectedByTap] = useState(false)
  const [scrollLocked, setScrollLocked] = useState(false)

  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
  const mainImageRef = useRef<HTMLDivElement>(null)

  const goPrev = () =>
    setSelectedIndex((i) => (i - 1 + images.length) % images.length)

  const goNext = () =>
    setSelectedIndex((i) => (i + 1) % images.length)

  // Two frames, so a cached image has a painted opacity-0 frame to fade from —
  // without it the browser jumps straight to opaque and the photo pops in.
  const handleLoad = (index: number) => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setLoaded((prev) => {
          if (prev[index]) return prev
          const updated = [...prev]
          updated[index] = true
          return updated
        })
      )
    )
  }

  // A cached image can finish before React attaches onLoad, so that event never
  // fires. Catch it from the ref instead, or the slide stays invisible forever.
  const catchAlreadyLoaded = (el: HTMLImageElement | null, index: number) => {
    if (el?.complete && el.naturalWidth > 0) handleLoad(index)
  }

  const hideArrows = pathname.includes("/journal")
  const isFullGallery = pathname?.endsWith("/full")
  const basePath = pathname?.endsWith("/full")
    ? pathname.replace(/\/full$/, "")
    : pathname

  // Keyboard navigation
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

  // Desktop wheel navigation
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)")
    if (!mediaQuery.matches) return

    const container = mainImageRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout | null = null
    let scrollAccumulated = 0
    let isLocked = false
    const SCROLL_THRESHOLD = 40
    // Fixed cooldown: after a step we ignore wheel events for COOLDOWN_MS, then
    // re-arm. The timer runs independently of incoming events, so this keeps the
    // pace snappy (one image per ~280ms while scrolling) rather than waiting for a
    // flick's full momentum tail to die. Trade-off: a hard pull whose inertia
    // outlasts the cooldown can advance more than one image.
    const COOLDOWN_MS = 290

    const handleWheel = (e: WheelEvent) => {
      if (!container.contains(e.target as Node)) return

      if (isLocked) return

      scrollAccumulated += e.deltaY

      if (Math.abs(scrollAccumulated) > SCROLL_THRESHOLD) {
        if (scrollAccumulated > 0) goNext()
        else goPrev()

        scrollAccumulated = 0
        isLocked = true
        if (scrollTimeout) clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          isLocked = false
          scrollAccumulated = 0
        }, COOLDOWN_MS)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => {
      window.removeEventListener("wheel", handleWheel)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
    // Note: selectedIndex is intentionally NOT a dependency — goNext/goPrev use
    // functional updates, so the listener never needs to be re-subscribed. If it
    // were, every navigation would reset the debounce lock and a single trackpad
    // flick would whip through several images.
  }, [images.length])

  // Mobile/tablet thumbnail scroll selection
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const mediaQuery = window.matchMedia("(min-width: 1280px)")
    if (mediaQuery.matches) return

    const handleScroll = () => {
      if (scrollLocked) return // 🔒 prevent flash on tap

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
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [images.length, scrollLocked])

  // Tap-centering effect
  useEffect(() => {
    if (!selectedByTap) return

    const container = containerRef.current
    const selectedThumb = thumbnailRefs.current[selectedIndex]
    if (!container || !selectedThumb) return

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

    // Unlock scroll after centering
    const timeout = setTimeout(() => setSelectedByTap(false), 300)
    return () => clearTimeout(timeout)
  }, [selectedIndex, selectedByTap])

  // Preload images
  useEffect(() => {
    if (!images?.length) return
    images.forEach((img) => {
      if (!img?.asset) return
      const preload = new window.Image()
      preload.src = urlFor(img.asset)
        .width(1600)
        .quality(60)
        .fit("max")
        .url()
    })
  }, [images])

  if (!images?.length) return null
  const selected = images[selectedIndex]

  return (
    <>
      <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row bar-hide lg:gap-7.5 xl:pt-6 xl:h-[calc(100vh-4rem)]">
        <div
          ref={mainImageRef}
          className="flex-1 flex justify-center items-end lg:items-center overflow-hidden scrollbar-hide pt-12 p-6 md:px-20 lg:p-0"
        >
          <figure className="relative w-full h-full overflow-hidden">
            {images.map((img, i) => {
              const fullSrc = urlFor(img.asset).width(1600).quality(60).url()
              // On mobile, portraits fill the frame (cover) but landscape images
              // keep their natural short proportions (contain) instead of being
              // scaled up to portrait height. Desktop always contains.
              const dims = img.asset.metadata?.dimensions
              const isLandscape = dims ? dims.width > dims.height : false
              // Shortest circular offset so next is always +1 (below) and prev
              // -1 (above) — this makes last↔first wrap as a seamless loop.
              const n = images.length
              let offset = (((i - selectedIndex) % n) + n) % n
              if (offset > n / 2) offset -= n
              return (
                <div
                  key={i}
                  className="absolute inset-0 will-change-transform"
                  style={{
                    // Vertical slide + crossfade: the selected image slides to
                    // centre and fades in; its neighbours slide away and fade out.
                    transform: `translateY(${offset * 100}%)`,
                    // Hold the slide transparent until its photo has decoded so
                    // it fades in like the rest of the site instead of popping.
                    opacity: offset === 0 && loaded[i] ? 1 : 0,
                    // Only the on-screen neighbours animate; off-screen images
                    // (incl. the one that wraps sides) snap so nothing flashes across.
                    transition:
                      Math.abs(offset) <= 1
                        ? "transform 500ms ease-out, opacity 500ms ease-out"
                        : "none",
                  }}
                >
                  <img
                    src={fullSrc}
                    alt={img.alt || title || ""}
                    ref={(el) => catchAlreadyLoaded(el, i)}
                    onLoad={() => handleLoad(i)}
                    // A broken image must not leave the slide permanently blank.
                    onError={() => handleLoad(i)}
                    className={`absolute inset-0 w-full h-full lg:object-contain ${
                      isLandscape ? "object-contain" : "object-cover"
                    }`}
                    draggable={false}
                  />
                </div>
              )
            })}
          </figure>
        </div>

        <div
          ref={containerRef}
          className="flex overflow-x-auto overflow-visible snap-x pl-[50vw] pr-[50vw] scrollbar-hide snap-x snap-proximity lg:w-[59px] lg:h-full lg:overflow-y-auto lg:flex-col lg:px-0 lg:pb-0 lg:mx-0 lg:pt-0 lg:justify-center xl:justify-start"
        >
          {images.map((img, i) =>
            img?.asset ? (
              <button
                key={i}
                ref={(el) => {
                  thumbnailRefs.current[i] = el
                }}
                onClick={() => {
                  setSelectedByTap(true)
                  setScrollLocked(true)
                  setSelectedIndex(i)
                  setTimeout(() => setScrollLocked(false), 300)
                }}
                className={`relative snap-center snap-always flex-shrink-0 overflow-hidden h-20 w-auto lg:w-full lg:h-auto ${
                  i === images.length - 1 ? "lg:mb-12" : ""
                }`}
                aria-label={`Select image ${i + 1}`}
              >
                <Image
                  src={urlFor(img.asset).width(400).auto("format").quality(75).url()}
                  alt={img.alt || title || ""}
                  width={img.asset.metadata?.dimensions?.width || 400}
                  height={img.asset.metadata?.dimensions?.height || 400}
                  placeholder="blur"
                  blurDataURL={img.asset.metadata?.lqip}
                  className="h-full w-auto lg:w-full lg:h-auto object-contain"
                />
                {i === selectedIndex && (
                  <TextDistortFilter className="pointer-events-none absolute inset-0 z-10">
                    <div className="h-full w-full outline outline-2 outline-white outline-offset-[-2px]" />
                  </TextDistortFilter>
                )}
              </button>
            ) : null
          )}
        </div>
      </div>

      {!hideArrows && (
        <div className="hidden xl:fixed xl:bottom-0 xl:left-0 xl:right-0 xl:h-16 xl:flex xl:flex-row xl:justify-between xl:z-50 xl:items-center xl:px-8 xl:font-nav xl:pointer-events-none">
          <TextDistortFilter>
            <button
              type="button"
              onClick={goNext}
              className="pointer-events-auto text-[14px] cursor-pointer uppercase hover:underline"
            >
              Down
            </button>
          </TextDistortFilter>
          <TextDistortFilter>
            <button
              type="button"
              onClick={goPrev}
              className="pointer-events-auto text-[14px] cursor-pointer uppercase hover:underline"
            >
              Up
            </button>
          </TextDistortFilter>
        </div>
      )}
    </>
  )
}
