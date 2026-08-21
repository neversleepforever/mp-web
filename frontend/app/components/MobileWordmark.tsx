import Image from "next/image"
import { TransitionLink } from "@/app/components/TransitionLink"

/** The wordmark that closes a page on mobile. The footer's fixed copy is
 *  hidden below md — it crowded the bottom of the screen — so each page ends
 *  with this instead, reached by scrolling. Pages pass `invert` when their
 *  ground is dark (the source SVG is black), and a negative bottom margin in
 *  `className` to cancel their own bottom padding — pages carry pb-12 or
 *  pb-16, and the mark should sit the same distance from the end on each. */
export default function MobileWordmark({
  invert = false,
  className = "",
}: {
  invert?: boolean
  className?: string
}) {
  return (
    <div className={`md:hidden flex justify-center pt-4 pb-0 ${className}`}>
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
