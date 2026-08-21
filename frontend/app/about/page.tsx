import TextDistortFilter from "@/app/components/TextFilter"
import MobileWordmark from "@/app/components/MobileWordmark"
import { HeroVignette, ContentVignette } from "@/app/components/Vignette"
import ScrollSwapHero from "@/app/components/ScrollSwapHero"
import { sanityFetch } from "@/sanity/lib/live"
import { aboutQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity"

// Re-fetch from Sanity at most once per minute so content edits appear without a redeploy
export const revalidate = 60

type ImageAsset = {
  _id: string
  url?: string
  metadata?: {
    lqip?: string
    dimensions?: {
      width: number
      height: number
    }
  }
}

interface AboutImage {
  alt?: string
  credit?: string
  asset?: ImageAsset
}

interface AboutData {
  _id: string
  content?: PortableTextBlock[]
  image?: AboutImage
  imageSecondary?: AboutImage
}

// Distortion is applied per text block rather than once around the whole column
// so photos stay outside the filter — the same split the heroes already use, and
// the way Services does it. An SVG filter re-rasterises its entire subtree on any
// change inside it, so a filter wrapping both the text and the photos made every
// frame of a photo's fade re-run feTurbulence over ~1700px. On a phone that drops
// frames and the fade reads as a blink.
const portableComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <TextDistortFilter>
        <h1 className="heading-1 [text-wrap:balance]">{children}</h1>
      </TextDistortFilter>
    ),
    h2: ({ children }) => (
      <TextDistortFilter>
        <h2 className="heading-2">{children}</h2>
      </TextDistortFilter>
    ),
    h3: ({ children }) => (
      <TextDistortFilter>
        <h3 className="heading-3">{children}</h3>
      </TextDistortFilter>
    ),
    normal: ({ children }) => (
      <TextDistortFilter>
        <p className="font-sans text-[22px] mt-6">{children}</p>
      </TextDistortFilter>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null
      const dims = value.asset.metadata?.dimensions
      return (
        <ContentVignette
          src={value.asset.url}
          alt={value.alt || ""}
          blurDataURL={value.asset.metadata?.lqip}
          width={dims?.width}
          height={dims?.height}
          className="mt-6"
        />
      )
    },
  },
}

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: aboutQuery })
  const about = data as AboutData | null

  if (!about) return <p>No About content found. Add it in Sanity Studio.</p>

  const heroImage = about.image
  const heroAsset = heroImage?.asset
  const heroSrc = heroAsset?.url || ""
  const heroAlt = heroImage?.alt || "Cover Image"

  // Optional second hero: when set in the Studio, the md+ hero swaps to it once
  // the content column is scrolled past halfway.
  const secondAsset = about.imageSecondary?.asset
  const secondSrc = secondAsset?.url || ""

  // On mobile the hero sits between the heading (first block) and the body.
  const content = about.content ?? []
  const [firstBlock, ...restBlocks] = content

  return (
    <>
      <div className=" md:grid md:grid-cols-2 dark:text-white bg-[#454545] ">
        {/* Hero — desktop only (left column). On mobile it renders inside the
            content column, under the heading. */}
        <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-[#0b0b0b] bg-[url('/images/scantexture.jpg')] bg-cover bg-center md:h-[calc(100dvh_-_var(--announcement-h,0px))] md:p-8">
          {secondSrc ? (
            <ScrollSwapHero
              images={[
                { src: heroSrc, alt: heroAlt, blurDataURL: heroAsset?.metadata?.lqip },
                {
                  src: secondSrc,
                  alt: about.imageSecondary?.alt || heroAlt,
                  blurDataURL: secondAsset?.metadata?.lqip,
                },
              ]}
              scrollContainerId="about-content-scroll"
              uidPrefix="hero-desktop"
              mode="wipe"
              variant="rose"
              className="aspect-[480/910] w-full max-w-[340px] lg:max-w-[calc(77dvh_*_480_/_910)]"
            />
          ) : (
            <HeroVignette
              src={heroSrc}
              alt={heroAlt}
              blurDataURL={heroAsset?.metadata?.lqip}
              uid="hero-desktop"
              variant="rose"
              className="aspect-[480/910] w-full max-w-[340px] lg:max-w-[calc(77dvh_*_480_/_910)]"
            />
          )}
        </div>

        {/* Mobile background is the fence alone over black — the grey
            scantexture layer is parked for now. Desktop keeps its own image. */}
        <div id="about-content-scroll" className="scrollbar-hide bg-black md:bg-[url('/images/scantexture-dark.jpg')] bg-cover bg-center md:col-start-2 pt-[56px] pb-16 px-6 md:pt-16 h-[calc(100dvh_-_var(--announcement-h,0px))] overflow-y-scroll xl:px-26 ">
          <div className="relative p-6 bg-black">
            {/* Distorted border, kept as its own overlay so the filter doesn't
                smear the mobile hero inside the box */}
            <TextDistortFilter className="pointer-events-none absolute inset-0">
              <div className="h-full w-full border-1" />
            </TextDistortFilter>
            {content.length ? (
              <>
                {firstBlock && (
                  <PortableText value={[firstBlock]} components={portableComponents} />
                )}
                {/* Mobile hero — crisp (outside the distort filter), under the heading */}
                <HeroVignette
                  src={heroSrc}
                  alt={heroAlt}
                  blurDataURL={heroAsset?.metadata?.lqip}
                  uid="hero-mobile"
                  strokeWidth={4.75}
                  variant="rose"
                  className="md:hidden aspect-[480/910] w-full max-w-[360px] mx-auto mt-6"
                />
                <PortableText value={restBlocks} components={portableComponents} />
              </>
            ) : (
              <p>No content added yet.</p>
            )}
          </div>
          <MobileWordmark invert className="-mb-10" />
        </div>
      </div>
    </>
  )
}
