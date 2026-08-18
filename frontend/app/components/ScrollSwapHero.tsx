"use client"

import { useEffect, useState } from "react"
import { HeroVignette } from "./Vignette"

export interface SwapImage {
  src: string
  alt: string
  blurDataURL?: string
}

type HeroProps = React.ComponentProps<typeof HeroVignette>

/**
 * A hero that steps through its images with the reader's progress: the scroll
 * range is split evenly, so two images swap at the halfway point (About) and
 * three at the third marks (Services). A plain position mapping — scrolling
 * back up steps back, and nothing cycles.
 *
 * Listens to the content column (found by id) rather than the window, because
 * these pages scroll inside that column on md+, not the document.
 */
export default function ScrollSwapHero({
  images,
  scrollContainerId,
  uidPrefix,
  variant,
  className = "",
}: {
  images: SwapImage[]
  scrollContainerId: string
  uidPrefix: string
  variant?: HeroProps["variant"]
  className?: string
}) {
  const [active, setActive] = useState(0)
  const count = images.length

  useEffect(() => {
    const el = document.getElementById(scrollContainerId)
    if (!el || count < 2) return

    // Cheap enough to run per scroll event directly: two property reads and
    // some arithmetic, with React batching the no-change sets.
    const measure = () => {
      const max = el.scrollHeight - el.clientHeight
      const ratio = max > 0 ? el.scrollTop / max : 0
      setActive(Math.min(count - 1, Math.floor(ratio * count)))
    }

    measure()
    el.addEventListener("scroll", measure, { passive: true })
    return () => el.removeEventListener("scroll", measure)
  }, [scrollContainerId, count])

  // Positioning lives on these wrappers, not on HeroVignette's className —
  // HeroVignette prepends `relative`, and Tailwind's `.relative` outranks
  // `.absolute` in the stylesheet, so an absolutely-stacked copy would compute
  // relative and collapse to zero height.
  return (
    <div className={`relative ${className}`}>
      {images.map((img, i) => (
        <div
          key={i}
          className={`${i === 0 ? "h-full w-full" : "absolute inset-0"} transition-opacity duration-700 ease-in-out ${
            active === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <HeroVignette
            src={img.src}
            alt={img.alt}
            blurDataURL={img.blurDataURL}
            uid={`${uidPrefix}-${i}`}
            variant={variant}
            className="h-full w-full"
          />
        </div>
      ))}
    </div>
  )
}
