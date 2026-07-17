"use client"

/**
 * StaggeredFilmstrip — a reusable vertical "filmstrip" carousel effect.
 *
 * Every image is normalised to the SAME height (`itemHeight`, a % of the frame)
 * regardless of its aspect ratio, then the strip stacks them vertically with a
 * small gap. The selected item is centred and its neighbours peek in above and
 * below. Advancing slides the strip; it wraps as a seamless endless loop.
 *
 * This is kept as a standalone reference — it's NOT the layout used by the Folio
 * gallery (which keeps each image's natural proportions). Drop it into any
 * project where a uniform-height vertical carousel is wanted.
 *
 * Nav: mouse wheel, ArrowUp/ArrowDown, or click a frame. Fully self-contained.
 *
 * Usage:
 *   <StaggeredFilmstrip images={[{ src, alt }, ...]} />
 */

import { useEffect, useState } from "react"

type FilmstripImage = { src: string; alt?: string }

export default function StaggeredFilmstrip({
  images,
  itemHeight = 68, // height of each frame, as a % of the viewport frame
  step = 105, // vertical spacing per frame, as a % of itemHeight (>100 adds a gap)
  duration = 500, // slide duration in ms
  className = "",
}: {
  images: FilmstripImage[]
  itemHeight?: number
  step?: number
  duration?: number
  className?: string
}) {
  const [selected, setSelected] = useState(0)
  const n = images.length

  const goNext = () => setSelected((i) => (i + 1) % n)
  const goPrev = () => setSelected((i) => (i - 1 + n) % n)

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === "arrowup" || k === "arrowleft") {
        e.preventDefault()
        goPrev()
      } else if (k === "arrowdown" || k === "arrowright") {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [n])

  // Wheel navigation, throttled.
  useEffect(() => {
    let cooling = false
    const onWheel = (e: WheelEvent) => {
      if (cooling || Math.abs(e.deltaY) < 8) return
      cooling = true
      if (e.deltaY > 0) goNext()
      else goPrev()
      setTimeout(() => (cooling = false), duration * 0.6)
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    return () => window.removeEventListener("wheel", onWheel)
  }, [n, duration])

  if (!images.length) return null

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((img, i) => {
        // Shortest circular offset: next is always +1 (below), prev -1 (above),
        // so first↔last wraps seamlessly.
        let offset = (((i - selected) % n) + n) % n
        if (offset > n / 2) offset -= n
        return (
          <div
            key={i}
            onClick={() => setSelected(i)}
            className="absolute left-1/2 top-1/2 will-change-transform cursor-pointer"
            style={{
              height: `${itemHeight}%`,
              transform: `translate(-50%, -50%) translateY(${offset * step}%)`,
              // Only near frames animate; the rest (incl. the one that wraps
              // sides) snap into place so nothing flashes across the viewport.
              transition:
                Math.abs(offset) <= 2
                  ? `transform ${duration}ms ease-out`
                  : "none",
            }}
          >
            <img
              src={img.src}
              alt={img.alt ?? ""}
              draggable={false}
              className="block h-full w-auto max-w-full object-contain select-none"
            />
          </div>
        )
      })}
    </div>
  )
}
