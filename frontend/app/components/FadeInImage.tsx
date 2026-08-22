"use client"

import Image, { ImageProps } from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

interface FadeInImageProps extends ImageProps {
  blurDataURL?: string
  className?: string
  /** Skip the scroll reveal and fade as soon as the image decodes. For anything
   *  above the fold that should never wait on an observer. */
  revealImmediately?: boolean
}

/** Reveal an image slightly before it reaches the viewport, so the fade reads as
 *  intentional rather than as a pop. */
const REVEAL_MARGIN = "200px"

/** Start the DOWNLOAD well before that: native lazy-loading looks only a short
 *  distance ahead, so a fast scroll outruns the fetch and lands on blank boxes
 *  that fill in late. Once an image is within this margin it flips to eager
 *  and the browser fetches it immediately. */
const PRELOAD_MARGIN = "1500px"

/** Native lazy-loading measures against the document viewport and ignores inner
 *  scrollers, so pages built on an `overflow-y-scroll` column (About) behave
 *  differently from pages that scroll the document (Services). Observing against
 *  the actual scroll parent makes the reveal identical on both. */
function scrollParentOf(el: HTMLElement | null): HTMLElement | null {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    const overflowY = getComputedStyle(node).overflowY
    if (overflowY === "auto" || overflowY === "scroll") return node
  }
  return null
}

export default function FadeInImage({
  className = "",
  blurDataURL,
  revealImmediately = false,
  ...props
}: FadeInImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(revealImmediately)
  const [nearView, setNearView] = useState(revealImmediately)
  const [revealed, setRevealed] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const markLoaded = useCallback((img: HTMLImageElement) => {
    img.setAttribute("data-loaded", "true")
    setLoaded(true)
  }, [])

  // An image that finishes decoding before React attaches onLoad — a cached
  // image, a back-navigation, or anything served fast — never fires the event,
  // which used to leave it stuck at opacity-0 forever. Catch that on mount.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) markLoaded(img)
  }, [markLoaded])

  useEffect(() => {
    if (inView) return
    const img = imgRef.current
    // No observer support (or no element yet) must never mean "never visible".
    if (!img || typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { root: scrollParentOf(img), rootMargin: REVEAL_MARGIN },
    )
    observer.observe(img)
    return () => observer.disconnect()
  }, [inView])

  // The far-look observer that drives the fetch (see PRELOAD_MARGIN).
  useEffect(() => {
    if (nearView) return
    const img = imgRef.current
    if (!img || typeof IntersectionObserver === "undefined") {
      setNearView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearView(true)
          observer.disconnect()
        }
      },
      { root: scrollParentOf(img), rootMargin: PRELOAD_MARGIN },
    )
    observer.observe(img)
    return () => observer.disconnect()
  }, [nearView])

  // A cached image can be loaded and in view before the browser has painted a
  // single opacity-0 frame — and CSS won't transition from a state it never
  // painted, so the image pops instead of fading. Waiting two frames guarantees
  // the transparent frame is on screen before we flip to opaque.
  useEffect(() => {
    if (!loaded || !inView || revealed) return
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setRevealed(true))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [loaded, inView, revealed])

  return (
    <Image
      {...props}
      ref={imgRef}
      // Flipping to eager once nearby starts the fetch immediately; before
      // that, next/image's default lazy applies. `priority` callers already
      // load eagerly and are unaffected.
      loading={nearView && !props.priority ? "eager" : undefined}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      draggable={false}
      className={`${className} transition-opacity duration-500 motion-reduce:transition-none ${
        revealed ? "opacity-100" : "opacity-0"
      }`}
      onLoad={(e) => markLoaded(e.currentTarget)}
    />
  )
}
