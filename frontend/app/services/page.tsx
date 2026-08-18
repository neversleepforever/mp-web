import React from "react"
import FadeInImage from "@/app/components/FadeInImage"
import Rates from "@/app/components/Rates"
import TextDistortFilter from "@/app/components/TextFilter"
import { HeroVignette, ContentVignette } from "@/app/components/Vignette"
import { sanityFetch } from "@/sanity/lib/live"
import { servicesQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity"
import Link from "next/link"

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

interface ServicesImage {
  alt?: string
  credit?: string
  asset?: ImageAsset
}

interface ServicesData {
  _id: string
  bannerEmail?: string
  content?: PortableTextBlock[]
    image?: ServicesImage
}

const replaceEmoji = (children: React.ReactNode): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (typeof child === "string" && child.includes("🍑")) {
      return child.split("🍑").flatMap((part, i, arr) =>
        i < arr.length - 1
          ? [part, <img key={i} src="peachvector.png" alt="peach" className="inline w-4 h-4 mx-3" />]
          : [part]
      )
    }
    return child
  })
}


const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="heading-1 flex justify-center items-center flex-wrap">{replaceEmoji(children)}</h1>,
    h2: ({ children }) => <h2 className="heading-2 flex justify-center items-center flex-wrap">{replaceEmoji(children)}</h2>,
    h3: ({ children }) => <h3 className="heading-3 flex justify-center items-center flex-wrap">{replaceEmoji(children)}</h3>,
    h4: ({ children }) => <h4 className="heading-4 flex justify-center items-center flex-wrap text-black">{replaceEmoji(children)}</h4>,
    normal: ({ children }) => <p className="mt-6 font-sans">{replaceEmoji(children)}</p>,
  },
  types: {
    image: ({ value }) =>
      value?.asset?.url ? (
        <figure className="my-6">
          <FadeInImage
            src={value.asset.url}
            alt={value.caption || ""}
            width={800}
            height={600}
            blurDataURL={value.asset.metadata?.lqip}
            className="w-full h-auto object-contain"
          />
          {value.caption && (
            <figcaption className="text-sm text-center mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
}

export default async function ServicesPage() {
  const { data } = await sanityFetch({
    query: servicesQuery,
    perspective: "published",
  })

  const services = data as ServicesData | null

  if (!services) {
    return <p>No Services content found. Add it in Sanity Studio.</p>
  }

  const heroImage = services.image
  const heroAsset = heroImage?.asset
  const heroSrc = heroAsset?.url || ""
  const heroAlt = heroImage?.alt || "Cover Image"

  const content = services.content ?? []

  // On mobile the hero renders inside the first services section, right under
  // its "Maggie Peach Services" title. This flag makes sure it's inserted once.
  let heroInserted = false

  const mainComponents: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <TextDistortFilter>
          <h1 className="heading-1 flex justify-center items-center flex-wrap">{replaceEmoji(children)}</h1>
        </TextDistortFilter>
      ),
      h2: ({ children }) => (
        <TextDistortFilter>
          <h2 className="heading-2 flex justify-center items-center flex-wrap">{replaceEmoji(children)}</h2>
        </TextDistortFilter>
      ),
      h3: ({ children }) => (
        <TextDistortFilter>
          <h3 className="heading-3 flex justify-center items-center flex-wrap">{replaceEmoji(children)}</h3>
        </TextDistortFilter>
      ),
      h4: ({ children }) => (
        <TextDistortFilter>
          <h4 className="heading-4 flex justify-center items-center flex-wrap text-black">{replaceEmoji(children)}</h4>
        </TextDistortFilter>
      ),
      normal: ({ children }) => (
        <TextDistortFilter>
          <p className="mt-6 font-sans">{replaceEmoji(children)}</p>
        </TextDistortFilter>
      ),
    },
    types: {
      ...portableTextComponents.types,
      servicesSection: ({ value }) => {
        const first = !heroInserted
        if (first) heroInserted = true
        return (
          <div className="relative p-4 my-4 bg-black">
            {/* Distorted border overlay (kept separate so the hero stays crisp) */}
            <TextDistortFilter className="pointer-events-none absolute inset-0">
              <div className="h-full w-full border" />
            </TextDistortFilter>
            <TextDistortFilter>
              <h1 className="heading-1 mb-6 flex justify-center items-center flex-wrap">{value.title}</h1>
            </TextDistortFilter>
            {/* Mobile hero — crisp, under the first section's title */}
            {first && (
              <HeroVignette
                src={heroSrc}
                alt={heroAlt}
                blurDataURL={heroAsset?.metadata?.lqip}
                uid="svc-hero-mobile"
                strokeWidth={4.75}
                variant="rose"
                className="md:hidden aspect-[480/910] w-full max-w-[360px] mx-auto my-6"
              />
            )}
            <TextDistortFilter>
              <div className="[&_p]:text-justify text-[20px]">
                <PortableText value={value.body} components={portableTextComponents} />
              </div>
            </TextDistortFilter>
          </div>
        )
      },
      ratesSection: ({ value }) => (
        <TextDistortFilter>
          <div className="border bg-black bg-[url('/images/book-bg-texture.svg')] bg-[length:100%_auto] bg-repeat-y bg-top">
            <Rates title={value.title} />
            <Link href={`mailto:"${services.bannerEmail}"`}>
              {/* Block, not flex: as a flex item the copy shrink-wrapped to its
                  own content width and sat centred with uneven gaps that looked
                  like a margin. text-center handles the alignment. */}
              <div className="bg-white text-[12.5px] p-4 text-center">
                {/* Render Sanity's hard breaks as spaces rather than <br>. Keeping
                    them pinned the copy to its own natural width so the band never
                    filled below lg; hiding them in CSS dropped the space instead
                    and ran "PERFORMANCE,CUSTOM" together. */}
                <PortableText
                  value={value.Banner}
                  components={{ ...portableTextComponents, hardBreak: () => " " }}
                />
              </div>
            </Link>
            <div className="p-4 text-center [&_ul]:mt-6 text-[20px]">
              <PortableText value={value.rates} components={portableTextComponents} />
            </div>
          </div>
        </TextDistortFilter>
      ),
      outcallSection: ({ value }) => (
        <TextDistortFilter>
          <div className="border p-4 my-4 bg-black bg-[url('/images/book-bg-texture.svg')] bg-[length:100%_auto] bg-repeat-y bg-top">
            <div className="text-center text-[20px]">
              <PortableText value={value.body} components={portableTextComponents} />
            </div>
          </div>
        </TextDistortFilter>
      ),
      virtualSection: ({ value }) => (
        <TextDistortFilter>
          <div className="border p-4 my-4 bg-black bg-[url('/images/book-bg-texture.svg')] bg-[length:100%_auto] bg-repeat-y bg-top">
            <div className="text-center text-[20px]">
              <PortableText value={value.body} components={portableTextComponents} />
            </div>
          </div>
        </TextDistortFilter>
      ),
      image: ({ value }) => {
        if (!value?.asset?.url) return null
        const dims = value.asset.metadata?.dimensions
        return (
          <TextDistortFilter>
            {/* No background: the photo and its caption sit straight on the
                page. It briefly carried black to stop the fence showing through
                the vignette's fade, but the fence is no longer behind it. */}
            <div className="mt-4">
              <ContentVignette
                src={value.asset.url}
                alt={value.alt || ""}
                blurDataURL={value.asset.metadata?.lqip}
                width={dims?.width}
                height={dims?.height}
              />
              {value.caption && (
                <figcaption className="heading-1 text-justify break-normal pt-4">{value.caption}</figcaption>
              )}
            </div>
          </TextDistortFilter>
        )
      },
    },
  }

  return (
    <>
      {/* bg-black rather than grey: the fixed mobile backdrop below only covers
          the viewport, so when Safari's toolbar collapses the strip it uncovers
          showed this element (and the white body) through. Colouring the page
          itself means there's nothing pale to reveal. */}
      <div className="md:grid md:grid-cols-2 dark:text-white bg-black md:bg-[#454545]">
        {/* Hero — desktop only (left column). On mobile it renders inside the
            content column, under the heading. */}
        <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-[#0b0b0b] bg-[url('/images/scantexture.jpg')] bg-cover bg-center md:h-[100dvh] md:p-8">
          <HeroVignette
            src={heroSrc}
            alt={heroAlt}
            blurDataURL={heroAsset?.metadata?.lqip}
            uid="svc-hero-desktop"
            variant="rose"
            className="aspect-[480/910] w-full max-w-[340px] h-auto lg:h-[77dvh] lg:w-auto lg:max-w-none"
          />
        </div>

        {/* Mobile fence, viewport-sized like About's. About's column is
            h-[100dvh] so bg-cover naturally sizes the fence to one screen;
            this column grows with its content and the page scrolls the
            document, so the same background stretched the fence across the
            full page height. A fixed layer pins it to the viewport instead. */}
        <div
          aria-hidden
          className="md:hidden fixed inset-0 z-0 bg-black bg-cover bg-center"
        />
        <div className="relative z-10 scrollbar-hide md:bg-[url('/images/scantexture.jpg')] bg-cover bg-center md:col-start-2 pt-8 pb-12 px-6 md:py-12 md:pl-4 md:pr-6 md:h-[100dvh] md:overflow-y-scroll xl:px-26">
          <div>
            {content.length ? (
              <PortableText value={content} components={mainComponents} />
            ) : (
              <p>No content added yet.</p>
            )}
          </div>
        </div>
      </div>
      {/* Fixed overlay — never gate it behind the scroll reveal, or a missed
          observer leaves the corner blank. */}
      <FadeInImage revealImmediately src="/images/band.png" alt="Adults Only" width={200} height={200} className="fixed box-content bottom-[0px] right-[0px] z-50 overflow-hidden" />
    </>
  )
}
