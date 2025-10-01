import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { PortableText, type PortableTextComponents } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { folioPagesSlugs, folioQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Link from "next/link"
import Image from "next/image"

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
  description?: {
    _type: "block"
    children?: {
      _type: "span"
      text?: string
    }[]
  }[]
  images?: {
    asset?: { url: string }
    alt?: string
    credit?: string
  }[]
}

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: folioPagesSlugs,
    perspective: "published",
    stega: false,
  })
  return data as { slug: string }[]
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: folioQuery,
    params,
    stega: false,
  })

  const folio = data as Folio | null
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = folio?.images?.[0]
    ? resolveOpenGraphImage(folio.images[0])
    : null

  return {
    title: folio?.title ?? "Untitled",
    description:
      folio?.subtitle ||
      folio?.description?.[0]?.children?.[0]?.text ||
      undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  }
}

export default async function FolioPage({ params }: Props) {
  const { data } = await sanityFetch({
    query: folioQuery,
    params,
  })

  const folio = data as Folio | null
  if (!folio?._id) return notFound()

  const firstImage = folio.images?.[0]

  return (
    <>
      {/* Background images (mobile + desktop) */}
      <div className="fixed inset-0 z-0 md:hidden pointer-events-none">
        <div className="w-full h-full bg-[url('/images/centerfoldmobilelight.png')] bg-cover bg-center" />
      </div>
      <div className="md:fixed md:inset-0 md:z-0 md:pointer-events-none">
        <div className="md:w-auto md:h-screen md:bg-[url('/images/centerfoldmedium.png')] md:bg-center md:bg-no-repeat md:bg-contain" />
      </div>

      {/* Main layout */}
      <div className="my-12 p-6 lg:p-0 lg:-my-0 lg:pr-7.5 lg:grid lg:grid-cols-2 h-screen">
        {/* Left side content */}
        <div className="overflow-y-scroll lg:min-h-screen lg:pt-54 lg:py-24 lg:px-30 ">
          <header className="pb-6">
            <h1 className="text-[38px] font-bold tracking-tight text-gray-900">
              {folio.title ?? "Untitled"}
            </h1>
            {folio.subtitle && (
              <p className="text-lg text-gray-600 mt-2">{folio.subtitle}</p>
            )}
            <div className="mt-8 text-[18px]">
              {folio.photographer && (
                <div className="uppercase">Shot By {folio.photographer}</div>
              )}
              {folio.date && <div>{folio.date}</div>}
            </div>
          </header>
          <div className="text-[22px]">
            {folio.description?.length ? (
              <PortableText
                components={portableTextComponents}
                value={folio.description}
              />
            ) : null}
          </div>
        </div>

        {/* Right side: preview image link */}
        <div className="lg:flex lg:flex-col lg:justify-center lg:pl-24">
          {firstImage?.asset?.url && (
            <Link href={`/folio/gallery/${folio.slug}/full`} className="block group">
              <div className="relative w-full flex justify-center items-center">
                <Image
                  src={firstImage.asset.url}
                  alt={firstImage.alt || folio.title || ""}
                  width={800}
                  height={600}
                  className="object-contain -z-10 w-auto max-h-[50vh] transition-transform duration-300"
                />
              </div>
              {firstImage.credit && (
                <p className="text-sm text-gray-500 mt-2">{firstImage.credit}</p>
              )}
              <p className="mt-4 uppercase text-sm underline">
                View Full Shoot →
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-7 uppercase mix-blend-difference z-90">
        <Link href="/folio" className="hover:underline text-[14px]">
          Folio
        </Link>
      </nav>
    </>
  )
}
