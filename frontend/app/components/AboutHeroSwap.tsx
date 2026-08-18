"use client"

import { useEffect, useState } from "react"
import { HeroVignette } from "./Vignette"

export interface SwapImage {
  src: string
  alt: string
  blurDataURL?: string
}

/**
 * The About hero, swapping between two images with the reader's progress:
 * the first shows for the top half of the content column, the second from the
 * halfway point down. A plain threshold toggle — scrolling back up brings the
 * first image back, and nothing cycles.
 *
 * Listens to the content column (found by id) rather than the window, because
 * the About page scrolls inside that column, not the document.
 */
export default function AboutHeroSwap({
  first,
  second,
  scrollContainerId,
  className = "",
}: {
  first: SwapImage
  second: SwapImage
  scrollContainerId: string
  className?: string
}) {
  const [pastHalf, setPastHalf] = useState(false)

  useEffect(() => {
    const el = document.getElementById(scrollContainerId)
    if (!el) return

    // Cheap enough to run per scroll event directly: two property reads and a
    // boolean, with React already batching the no-change sets.
    const measure = () => {
      const max = el.scrollHeight - el.clientHeight
      setPastHalf(max > 0 && el.scrollTop / max >= 0.5)
    }

    measure()
    el.addEventListener("scroll", measure, { passive: true })
    return () => el.removeEventListener("scroll", measure)
  }, [scrollContainerId])

  // Positioning lives on these wrappers, not on HeroVignette's className —
  // HeroVignette prepends `relative`, and Tailwind's `.relative` outranks
  // `.absolute` in the stylesheet, so an absolutely-stacked copy would compute
  // relative and collapse to zero height.
  return (
    <div className={`relative ${className}`}>
      <div
        className={`h-full w-full transition-opacity duration-700 ease-in-out ${
          pastHalf ? "opacity-0" : "opacity-100"
        }`}
      >
        <HeroVignette
          src={first.src}
          alt={first.alt}
          blurDataURL={first.blurDataURL}
          uid="hero-desktop"
          className="h-full w-full"
        />
      </div>
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          pastHalf ? "opacity-100" : "opacity-0"
        }`}
      >
        <HeroVignette
          src={second.src}
          alt={second.alt}
          blurDataURL={second.blurDataURL}
          uid="hero-desktop-b"
          className="h-full w-full"
        />
      </div>
    </div>
  )
}
