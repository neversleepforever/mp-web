"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { HeroVignette } from "./Vignette"

// Same mask the HeroVignette applies to its photo, so the sheen is clipped to
// the notched frame instead of sweeping past its corners.
const sheenMask: CSSProperties = {
  maskImage: "url(/vignette-mask.svg)",
  WebkitMaskImage: "url(/vignette-mask.svg)",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
}

// Wipe states: a level edge, no angle — the reveal reads as a scan pass, the
// same vertical axis the gallery carousel already moves on. The edge follows
// the scroll: down-scroll sweeps down, back-scroll sweeps up (keyframes in
// globals.css).
const SHOWN = "inset(0% 0% 0% 0%)"
const HIDDEN = "inset(0% 0% 100% 0%)"

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
 *
 * Two transition modes: "fade" crossfades; "wipe" slides a slanted clip-path
 * edge across, the incoming image wiping over the outgoing one.
 */
export default function ScrollSwapHero({
  images,
  scrollContainerId,
  uidPrefix,
  variant,
  mode = "fade",
  className = "",
}: {
  images: SwapImage[]
  scrollContainerId: string
  uidPrefix: string
  variant?: HeroProps["variant"]
  mode?: "fade" | "wipe"
  className?: string
}) {
  const [active, setActive] = useState(0)
  // Increments on every image change so the sheen overlay remounts and its
  // one-shot animation replays. 0 = never swapped, so nothing plays on load.
  const [sweep, setSweep] = useState(0)
  // The layer being wiped over — kept above the rest so the incoming edge
  // reveals it, not whichever image happens to be later in the DOM.
  const [prevLayer, setPrevLayer] = useState(0)
  // Scrolling down sweeps the edge downward; scrolling back sweeps it up —
  // the same direction-following the gallery carousel uses.
  const [wipeUp, setWipeUp] = useState(false)
  const prevActive = useRef(0)
  const count = images.length

  useEffect(() => {
    if (prevActive.current !== active) {
      setWipeUp(active < prevActive.current)
      setPrevLayer(prevActive.current)
      prevActive.current = active
      setSweep((s) => s + 1)
    }
  }, [active])

  useEffect(() => {
    const el = document.getElementById(scrollContainerId)
    if (!el || count < 2) return

    // Cheap enough to run per scroll event directly: two property reads and
    // some arithmetic, with React batching the no-change sets.
    const measure = () => {
      const max = el.scrollHeight - el.clientHeight
      // Clamp: rubber-band overscroll reports scrollTop below 0 (and past max),
      // which floored to active = -1 — no such image, so the first hero played
      // its rewind over nothing and wiped back in when the bounce settled.
      const ratio = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0
      setActive(Math.min(count - 1, Math.floor(ratio * count)))
    }

    measure()
    el.addEventListener("scroll", measure, { passive: true })
    return () => el.removeEventListener("scroll", measure)
  }, [scrollContainerId, count])

  /** Per-layer presentation in wipe mode. Scrolling down: the incoming layer
   *  wipes in over the top, a scan pass downward. Scrolling up: the true
   *  reverse — the outgoing layer rolls back up the way it came, uncovering
   *  the earlier image sitting fully shown beneath it. Keyframes fix start
   *  states, and nothing animates before the first swap, so page load is
   *  still. */
  const layerClip = (i: number): CSSProperties => {
    if (mode !== "wipe") return {}
    const isActive = i === active
    const isPrev = i === prevLayer && !isActive

    if (wipeUp && sweep > 0) {
      if (isPrev)
        return {
          clipPath: HIDDEN,
          animation: "hero-wipe-out 1200ms ease-in-out",
          zIndex: 2,
        }
      return { clipPath: isActive ? SHOWN : HIDDEN, zIndex: isActive ? 1 : 0 }
    }

    return {
      clipPath: isActive || isPrev ? SHOWN : HIDDEN,
      animation:
        isActive && sweep > 0 ? "hero-wipe-down 1200ms ease-in-out" : undefined,
      zIndex: isActive ? 2 : isPrev ? 1 : 0,
    }
  }

  // Positioning lives on these wrappers, not on HeroVignette's className —
  // HeroVignette prepends `relative`, and Tailwind's `.relative` outranks
  // `.absolute` in the stylesheet, so an absolutely-stacked copy would compute
  // relative and collapse to zero height.
  return (
    <div className={`relative ${className}`}>
      {images.map((img, i) => (
        <div
          key={i}
          style={layerClip(i)}
          // Every layer absolute: the in-flow first layer used h-full, which
          // iOS WebKit resolves wrongly against an aspect-ratio parent (it
          // rendered 659px in a 645px box on iPad, making swaps visibly jump
          // size). absolute inset-0 is exact in every engine; the wrapper's
          // aspect-ratio alone sets the size.
          className={`absolute inset-0 ${
            mode === "fade"
              ? `transition-opacity duration-700 ease-in-out ${
                  active === i ? "opacity-100" : "opacity-0"
                }`
              : ""
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
      {/* One-shot specular sweep over the crossfade — fade mode only: in wipe
          mode the travelling edge is the effect, and the sheen on top of it
          read as too much. Purely additive either way. */}
      {mode === "fade" && sweep > 0 && (
        <div
          key={sweep}
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ ...sheenMask, zIndex: 3 }}
        >
          <div className="hero-sheen" />
        </div>
      )}
    </div>
  )
}
