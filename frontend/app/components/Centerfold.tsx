"use client"

import React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Centerfold() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  if (pathname === "/folio") return null;

  const isDark =
    pathname?.startsWith("/about") ||
    // pathname?.startsWith("/contact") ||
    pathname?.startsWith("/services")

  // Dark/textured 2-column pages: their center is too light for the exclusion fold to show,
  // so paint a dark gutter BEHIND the fold to give the staples/crease something to render against.
  const isGutter =
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/services") ||
    pathname?.startsWith("/bookings") ||
    pathname?.startsWith("/contact")

  // Folio detail pages (gallery landing, video, journal) are bright/white — they get the same
  // fold gutter but MUCH lighter (a soft page-fold shadow, not the strong dark crease the dark
  // pages need). The /folio/gallery/[slug]/full viewer is excluded — its full-bleed project
  // images shouldn't be cut by a crease.
  const isFolio =
    !!pathname?.startsWith("/folio/") && !pathname.endsWith("/full")
  const showGutter = isGutter || isFolio

  const gutterDesktop = isFolio
    ? "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.07) 42%, rgba(0,0,0,0.14) 50%, rgba(0,0,0,0.07) 58%, rgba(0,0,0,0) 100%)"
    : "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)"
  const gutterMobile = isFolio
    ? "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 42%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 58%, rgba(0,0,0,0) 100%)"
    : "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0.38) 50%, rgba(0,0,0,0.22) 58%, rgba(0,0,0,0) 100%)"

  return (
   <>
    <div className="fixed top-0 left-0 w-full h-[100vh] md:hidden pointer-events-none z-50 bg-[url('/images/mobilestaples.png')] bg-no-repeat bg-center" />

    {/* Desktop center-fold gutter — strong dark crease on dark pages, soft fold-shadow on folio */}
    {showGutter && (
      <div
        className="hidden md:block fixed inset-y-0 left-1/2 -translate-x-1/2 w-[200px] z-[45] pointer-events-none"
        style={{ background: gutterDesktop }}
      />
    )}

    {/* Mobile center-fold gutter — narrower variant of the same */}
    {showGutter && (
      <div
        className="md:hidden fixed inset-y-0 left-1/2 -translate-x-1/2 w-[150px] z-[45] pointer-events-none"
        style={{ background: gutterMobile }}
      />
    )}

    {/* Base shadow layer — always present.
        Shadow2.png is only 367px wide, so desktop upscales it ~3.5x into a soft, wide fold
        while mobile renders it near 1:1, leaving a crisp/hard crease. Blur it on mobile only
        to recover the same soft fold. */}
    <div className="fixed z-50 inset-0 mix-blend-exclusion pointer-events-none blur-[5px] md:blur-none">
      <Image
        src="/images/Shadow2.png"
        alt=""
        fill
        className="object-cover"
      />
    </div>

    {/* Second shadow layer — only on dark pages, stacked for density (desktop only;
        on narrow mobile the doubled exclusion turns the soft fold into a harsh seam) */}
    {isDark && (
      <div className="hidden md:block fixed z-50 inset-0 mix-blend-exclusion pointer-events-none">
        <Image
          src="/images/Shadow2.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
    )}

    <div className="md:fixed md:inset-0 md:pointer-events-none z-50">
      <div className="md:w-auto md:mt-16 md:h-[calc(100vh-8rem)] md:bg-[url('/images/staples.png')] md:bg-center md:bg-no-repeat md:bg-contain md:mix-blend-difference" />
    </div>
   </>
  )
}