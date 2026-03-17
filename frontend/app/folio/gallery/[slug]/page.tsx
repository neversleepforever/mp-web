import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { PortableText, type PortableTextComponents } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { folioPagesSlugs, folioQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import { urlFor } from "@/sanity/lib/imageBuilder"
import Link from "next/link"
import TextDistortFilter from "@/app/components/TextFilter"
import Gallery, { GalleryImage } from "@/app/components/Gallery"
import FadeInImage from "@/app/components/FadeInImage"
import { TransitionLink } from "@/app/components/TransitionLink"

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="heading-1">{children}</h1>,
    h2: ({ children }) => <h2 className="heading-2">{children}</h2>,
    h3: ({ children }) => <h3 className="heading-3">{children}</h3>,
    normal: ({ children }) => <p className="mt-6 font-sans">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mt-4 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mt-4 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-6">{children}</li>,
    number: ({ children }) => <li className="ml-6">{children}</li>,
  },
}
export interface Folio {
  _id: string
  title?: string
  subtitle?: string
  photographer?: string
  date?: string
  slug: string
  description?: any[]
  images?: GalleryImage[]
  landingImage?: GalleryImage
}

export const revalidate = 60

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: folioPagesSlugs,
    perspective: "published",
    stega: false,
  })
  return (data || []).map((item: any) => ({ slug: item.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const { data } = await sanityFetch({
    query: folioQuery,
    params: { slug },
    stega: false,
  })

  const folio = data as Folio | null
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = folio?.images?.[0]
    ? resolveOpenGraphImage(folio.images[0])
    : null

  return {
    title: folio?.title ?? "Untitled",
    description: folio?.subtitle || folio?.description?.[0]?.children?.[0]?.text,
    openGraph: { images: ogImage ? [ogImage, ...previousImages] : previousImages },
  }
}

export default async function FolioPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data } = await sanityFetch({
    query: folioQuery,
    params: { slug },
  })

  const folio = data as Folio | null
  if (!folio?._id) return notFound()

  const firstImage = folio.landingImage ? folio.landingImage : folio.images?.[0]

const viewFullShootButton = (
  <Link href={`/folio/gallery/${folio.slug}/full`}>
    <p className="w-full text-left mt-7 mb-7 xl:text-center place-self-end md:mb-0 md:mt-4 uppercase text-sm hover:underline">
      View Full Shoot
    </p>
  </Link>
)

  return (
    <div className="overflow-hidden lg:overflow-visible my-12 md:my-16 p-6 md:p-0 pt-0 xl:p-0 xl:-my-0 xl:grid xl:grid-cols-2 xl:h-screen lg:overscroll-none">
        <div className="overflow-y-scroll md:px-20 lg:pb-16 xl:min-h-screen xl:pt-54 xl:py-24 lg:px-30 lg:overscroll-none scrollbar-hide">
          <TextDistortFilter>
          <header className="md:pb-6">
            <h1 className="heading-1 text-justify">
              {folio.title ?? "Untitled"}
            </h1>
            {folio.subtitle && (
              <p className="heading-3 mt-2">{folio.subtitle}</p>
            )}
            <div className="mt-12 text-[18px] font-extrabold mb-3">
                  {folio.date && (
                  <p className="uppercase font-sans text-[18px]">
                    {new Date(folio.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              {folio.photographer && (
                <div className="font-sans text-[18px] uppercase md:font-nav md:text-[12px]">{folio.photographer}</div>
              )}
            </div>
          </header>
          <div className="text-[22px] mt-12">
            {folio.description?.length ? (
              <PortableText
                components={portableTextComponents}
                value={folio.description}
              />
            ) : null}
          </div>
          <div className="hidden md:block xl:hidden">{viewFullShootButton}</div>
          </TextDistortFilter>
        </div>
        <div className="hidden md:flex md:flex-col md:justify-between md:my-24 xl:my-0 md:h-[75vh] xl:h-[100vh]">
        {firstImage?.asset && (
          <TransitionLink href={`/folio/gallery/${folio.slug}/full`} className="block group flex-1 flex justify-center items-center">
            <div className="relative w-full flex justify-center items-center">
              <FadeInImage
                src={urlFor(firstImage.asset).width(1200).quality(80).url()}
                alt={firstImage.alt || folio.title || ""}
                width={firstImage.asset.metadata?.dimensions?.width || 1200}
                height={firstImage.asset.metadata?.dimensions?.height || 800}
                placeholder="blur"
                blurDataURL={firstImage.asset.metadata?.lqip}
                className="object-contain w-auto md:max-h-[75vh]"
              />
            </div>
              {firstImage?.credit && (
                <p className="text-sm text-gray-500 mt-2">{firstImage.credit}</p>
              )}
          </TransitionLink>
        )}
      </div>
              <div className="overscroll-none overflow-x-hidden -ml-6 -mr-6 md:hidden">
          {folio.images?.length ? (
            <Gallery images={folio.images} title={folio.title} />
          ) : null}
        </div>
      </div>

    
  )
}
