"use client"

import { useEffect, useState } from "react"

/** True once the page is scrolled to within `margin` of the document's end —
 *  drives the mobile folio CTAs (Submit / Don't Stop), which stay hidden until
 *  the thumbnails at the page's bottom are in view, then fade in.
 *
 *  Only meaningful below the xg breakpoint (the locked viewer owns the CTAs
 *  above it); at xg+ this reports true so it never interferes. Pages shorter
 *  than the viewport are "at the bottom" from the start. Re-checked per scroll
 *  event rather than via resize/matchMedia listeners alone — those events are
 *  not guaranteed on every viewport change (see chrome-browser-quirks). */
export default function useNearBottom(margin = 160): boolean {
  const [near, setNear] = useState(false)

  useEffect(() => {
    const check = () => {
      if (window.matchMedia("(min-width: 1133px)").matches) {
        setNear(true)
        return
      }
      const doc = document.documentElement
      setNear(window.innerHeight + window.scrollY >= doc.scrollHeight - margin)
    }
    check()
    window.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check)
    return () => {
      window.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [margin])

  return near
}
