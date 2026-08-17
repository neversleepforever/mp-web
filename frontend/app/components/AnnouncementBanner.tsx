"use client"

import { useEffect, useState } from "react"

export interface AnnouncementData {
  enabled?: boolean | null
  newsletterText?: string | null
  newsletterUrl?: string | null
  bookingText?: string | null
}

/** Stays dismissed for the rest of the visit, but returns next session. */
const DISMISS_KEY = "announcement-dismissed"

/** Bar height; the fixed Header reads it via --announcement-h to sit below. */
const BAR_HEIGHT = "30px"

/**
 * Slim black bar fixed above the navigation. Content and the on/off switch live
 * in the Studio's Announcement Banner document. The age-gate overlay covers the
 * whole viewport, so this is first seen right after proceeding through it.
 */
export default function AnnouncementBanner({ data }: { data: AnnouncementData | null }) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) setDismissed(true)
  }, [])

  const visible = Boolean(data?.enabled) && !dismissed

  // The Header is position: fixed, so the banner can't push it down through
  // normal flow — it hands its height over as a CSS variable instead.
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--announcement-h", visible ? BAR_HEIGHT : "0px")
    return () => root.style.setProperty("--announcement-h", "0px")
  }, [visible])

  if (!visible) return null

  const close = () => {
    sessionStorage.setItem(DISMISS_KEY, "1")
    setDismissed(true)
  }

  return (
    <div
      style={{ height: BAR_HEIGHT }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-[6px] md:gap-[10px] bg-black px-3 pr-9 font-sans font-normal text-[10px] md:text-[11px] uppercase tracking-wide whitespace-nowrap text-white"
    >
      {data?.newsletterText && (
        <a
          href={data.newsletterUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          // line-through replaces the underline on hover — they're the same
          // CSS property, so no separate "remove underline" is needed (and
          // adding hover:no-underline would cancel the strike instead).
          className="underline decoration-1 underline-offset-2 hover:line-through"
        >
          {data.newsletterText}
        </a>
      )}
      {data?.bookingText && <span>{data.bookingText}</span>}
      <button
        type="button"
        onClick={close}
        aria-label="Close announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer px-1 text-[11px] leading-none hover:opacity-70"
      >
        ✕
      </button>
    </div>
  )
}
