"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import TextDistortFilter from "./TextFilter"
import { TransitionLink } from "./TransitionLink"

/** Dark end to end, so the wordmark is white. Everywhere else it stays black. */
const DARK_PAGES = ["/about", "/services", "/bookings", "/contact"]

export default function Footer() {
  const pathname = usePathname()

  const isFolioPage = pathname?.startsWith("/folio")
  const isGalleryPage = pathname?.startsWith("/folio/gallery/")
  const isFullGalleryPage = pathname?.endsWith("/full")

  // Fixed per page rather than measured against whatever sits behind it.
  // Watching the artwork meant the mark changed colour mid-swipe as one photo
  // slid out and the next slid in — a flash on every carousel move, for a
  // wordmark that only ever needs two states.
  const isDarkPage = DARK_PAGES.some((p) => pathname?.startsWith(p))

  const fullGalleryHref = isGalleryPage
    ? `${pathname?.replace(/\/full$/, "")}/full`
    : null

  // The folio index lives at the root now; only project pages sit under /folio.
  const backHref = isFolioPage ? "/" : null

  return (
    <footer className="fixed bottom-0 left-0 right-0 py-4 px-7 w-full z-40">
      {/* Distortion is applied per text link rather than around the whole row,
          so the wordmark stays clean. */}
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 flex justify-start">
          {isFolioPage && !pathname.endsWith("/folio") && !isFullGalleryPage && (
            <TextDistortFilter>
              <TransitionLink
                href={backHref ?? "/"}
                className="uppercase hover:underline text-[14px] text-black mix-blend-difference"
              >
                Back
              </TransitionLink>
            </TextDistortFilter>
          )}
        </div>
        {/* Hidden on folio project pages (galleries, journals, videos, stills —
            everything under /folio/ now that the grid lives at /): the wordmark
            sat over the thumbnail rail there. */}
        {!isFolioPage && (
          <div className=" h-[30px] flex-shrink-0 flex justify-center">
            <TransitionLink href={"/"}>
              <Image
                src="/images/logo/mistress-maggie-peach-1-line-black.svg"
                alt="Logo"
                width={180}
                height={24}
                // Source SVG is black; inverted to white on the dark pages.
                // Inline because Tailwind's `invert` resolves to invert(0) here.
                className="object-contain lg:hidden"
                style={{filter: isDarkPage ? "invert(1)" : undefined}}
              />
            </TransitionLink>
          </div>
        )}
        <div className="flex-1 flex justify-end">
          {isGalleryPage && !isFullGalleryPage && (
            <TextDistortFilter>
              <TransitionLink
                href={fullGalleryHref ?? "#"}
                className="hidden xl:block uppercase hover:underline text-[14px] text-black mix-blend-difference"
              >
                View Full Shoot
              </TransitionLink>
            </TextDistortFilter>
          )}
        </div>
      </div>
    </footer>
  )
}
