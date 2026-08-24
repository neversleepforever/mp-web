"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { TransitionLink } from "@/app/components/TransitionLink"

/** The wordmark that closes a page on mobile. The footer's fixed copy is
 *  hidden below md — it crowded the bottom of the screen — so each page ends
 *  with this instead, reached by scrolling. Pages pass `invert` when their
 *  ground is dark (the source SVG is black), and a negative bottom margin in
 *  `className` to cancel their own bottom padding — pages carry pb-12 or
 *  pb-16, and the mark should sit the same distance from the end on each.
 *
 *  Fades in as it enters the viewport (the same rhythm as the folio CTAs).
 *  An IntersectionObserver on the element itself, not a window-scroll check:
 *  several pages scroll an inner column, where window.scrollY never moves —
 *  viewport intersection is true visibility on both kinds of page. */
export default function MobileWordmark({
  invert = false,
  className = "",
}: {
  invert?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    // No observer support must never mean "never visible".
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      setShown(entries.some((entry) => entry.isIntersecting))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`md:hidden flex justify-center pt-4 pb-0 transition-opacity duration-500 ${
        shown ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <TransitionLink href="/">
        <Image
          src="/images/logo/mistress-maggie-peach-1-line-black.svg"
          alt="Mistress Maggie Peach"
          width={180}
          height={24}
          // Inline because Tailwind's `invert` resolves to invert(0) here.
          className="object-contain"
          style={{ filter: invert ? "invert(1)" : undefined }}
        />
      </TransitionLink>
    </div>
  )
}
