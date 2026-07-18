import TextDistortFilter from "@/app/components/TextFilter"
import { HeroVignette, ContentVignette } from "@/app/components/Vignette"
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
}

const portableComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="heading-1 [text-wrap:balance]">{children}</h1>,
    h2: ({ children }) => <h2 className="heading-2">{children}</h2>,
    h3: ({ children }) => <h3 className="heading-3">{children}</h3>,
    normal: ({ children }) => <p className="font-sans text-[22px] mt-6">{children}</p>,
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

  // On mobile the hero sits between the heading (first block) and the body.
  const content = about.content ?? []
  const [firstBlock, ...restBlocks] = content

  return (
    <>
      <div className=" md:grid md:grid-cols-2 dark:text-white bg-[#454545] ">
        {/* Hero — desktop only (left column). On mobile it renders inside the
            content column, under the heading. */}
        <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-[#0b0b0b] bg-[url('/images/book-bg-texture.svg'),url('/images/scantexture.jpg')] bg-cover bg-center md:h-[100dvh] md:p-8">
          <HeroVignette
            src={heroSrc}
            alt={heroAlt}
            blurDataURL={heroAsset?.metadata?.lqip}
            uid="hero-desktop"
            className="aspect-[480/910] w-full max-w-[340px] h-auto lg:h-[77dvh] lg:w-auto lg:max-w-none"
          />
        </div>

        <div className="scrollbar-hide bg-black bg-[url('/images/book-bg-texture.svg'),url('/images/scantexture.jpg')] md:bg-[url('/images/scantexture-dark.jpg')] bg-cover bg-center md:col-start-2 pt-12 pb-16 px-6 md:pt-16 h-[100dvh] overflow-y-scroll xl:px-26 ">
          <div className="relative p-6 bg-black">
            {/* Distorted border, kept as its own overlay so the filter doesn't
                smear the mobile hero inside the box */}
            <TextDistortFilter className="pointer-events-none absolute inset-0">
              <div className="h-full w-full border-1" />
            </TextDistortFilter>
            {content.length ? (
              <>
                {firstBlock && (
                  <TextDistortFilter>
                    <PortableText value={[firstBlock]} components={portableComponents} />
                  </TextDistortFilter>
                )}
                {/* Mobile hero — crisp (outside the distort filter), under the heading */}
                <HeroVignette
                  src={heroSrc}
                  alt={heroAlt}
                  blurDataURL={heroAsset?.metadata?.lqip}
                  uid="hero-mobile"
                  strokeWidth={4.75}
                  className="md:hidden aspect-[480/910] w-full max-w-[360px] mx-auto mt-6"
                />
                <TextDistortFilter>
                  <PortableText value={restBlocks} components={portableComponents} />
                </TextDistortFilter>
              </>
            ) : (
              <p>No content added yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
