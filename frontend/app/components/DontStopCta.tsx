"use client"

import TextDistortFilter from "./TextFilter"
import { TransitionLink } from "./TransitionLink"
import useNearBottom from "./useNearBottom"

/** The below-xg "Don't Stop" — next folio entry, bottom-right, mirroring the
 *  footer's Submit (né Back) bottom-left with the same padding. At xg the
 *  locked viewer's corner bar (galleries/videos) or the journal's standing
 *  copy takes over, so this hides there. Rendered by the project pages, which
 *  know the next entry; the Footer only knows the pathname.
 *
 *  Hidden until the page is scrolled near its end (where the thumbnails
 *  live), then fades in — and back out on the way up. */
export default function DontStopCta({ href }: { href: string }) {
  const nearBottom = useNearBottom()
  return (
    <div
      className={`xg:hidden fixed bottom-0 right-0 py-4 px-7 z-50 transition-opacity duration-500 ${
        nearBottom ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <TextDistortFilter>
        <TransitionLink
          href={href}
          className="uppercase hover:underline text-[12px] text-black mix-blend-difference font-nav"
        >
          {"Don't Stop"}
        </TransitionLink>
      </TextDistortFilter>
    </div>
  )
}
