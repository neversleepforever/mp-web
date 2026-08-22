import type { CSSProperties } from "react"
import FadeInImage from "@/app/components/FadeInImage"
import {
  VignetteBorderPortrait,
  VignetteBorderLandscape,
  VignetteBorderContentPortrait,
  type PortraitGradient,
} from "@/app/components/VignetteBorder"

// Applies a mask SVG to an element via CSS (both standard and -webkit- for Safari).
const maskStyle = (url: string): CSSProperties => ({
  maskImage: `url(${url})`,
  WebkitMaskImage: `url(${url})`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
})

// Without a `sizes` prop, a `fill` image falls back to 100vw and the browser
// downloads the largest srcset candidate (3840px) — ~100x the pixels needed on a
// phone. These describe the real rendered widths so the browser picks sanely.
// Hero caps around 340-400px wide; content photos fill their column.
const HERO_SIZES = "(min-width: 768px) 400px, 100vw"
// 668px from xl up: the right-column stacks are capped there now, so 40vw
// over-fetched on large screens (1536px files at 1920 retina vs the 1336
// actually needed) — bigger files stream longer and read as missing content.
const CONTENT_SIZES = "(min-width: 1280px) 668px, (min-width: 768px) 50vw, 100vw"

/** Portrait hero photo scaled inside the vignette mask, with the peach gradient
 *  border. `uid` must be unique per instance (drives the border's gradient/filter
 *  ids so two heroes on a page don't collide). */
export function HeroVignette({
  src,
  alt,
  blurDataURL,
  className = "",
  uid,
  strokeWidth,
  variant,
  sizes = HERO_SIZES,
}: {
  src: string
  alt: string
  blurDataURL?: string
  className?: string
  uid: string
  strokeWidth?: number
  variant?: PortraitGradient
  sizes?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0" style={maskStyle("/vignette-mask.svg")}>
        <FadeInImage
          src={src}
          alt={alt}
          blurDataURL={blurDataURL}
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      </div>
      <VignetteBorderPortrait
        uid={uid}
        strokeWidth={strokeWidth}
        variant={variant}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />
    </div>
  )
}

/** Content photo scaled inside a mask; the frame orientation (and its 2px light
 *  border) follows the photo — portrait photo → portrait frame, else landscape. */
export function ContentVignette({
  src,
  alt,
  blurDataURL,
  width,
  height,
  className = "",
  sizes = CONTENT_SIZES,
  // The house treatment suits the site's darker photos; bright images blow out
  // under contrast-200 (the Policies spread washed to near-white), so callers
  // can soften it.
  filterClassName = "md:grayscale md:contrast-200",
  // Landscape frame stroke — light by default (frames sit on dark grounds);
  // pages on light paper (Policies) pass black.
  borderStroke,
}: {
  src: string
  alt: string
  blurDataURL?: string
  width?: number
  height?: number
  className?: string
  sizes?: string
  filterClassName?: string
  borderStroke?: string
}) {
  const isPortrait = width != null && height != null ? height > width : false
  // The stock mask/border pair only — they're drawn to match each other, so
  // the photo's cut corners and the stroked outline align at every size.
  // (A "bleed" variant that altered the mask to kill its ~2px margin seam
  // desynced the pair under responsive scaling; the seam hides inside the
  // stroke anyway.)
  const maskUrl = isPortrait ? "/vignette-cp-mask.svg" : "/vignette-h-mask.svg"
  const aspect = isPortrait ? "aspect-[612/889]" : "aspect-[612/406]"
  const mask: CSSProperties = maskStyle(maskUrl)
  return (
    <div className={`relative w-full ${aspect} ${className}`}>
      <div className="absolute inset-0" style={mask}>
        <FadeInImage
          src={src}
          alt={alt}
          fill
          blurDataURL={blurDataURL}
          sizes={sizes}
          className={`object-cover ${filterClassName}`}
        />
      </div>
      {isPortrait ? (
        <VignetteBorderContentPortrait className="pointer-events-none absolute inset-0 h-full w-full select-none" />
      ) : (
        <VignetteBorderLandscape
          stroke={borderStroke}
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
        />
      )}
    </div>
  )
}
