import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { PortableText, type PortableTextComponents } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { folioPagesSlugs, folioQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Link from "next/link"
import Image from "next/image"
import Centerfold from "@/app/components/Centerfold"

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="heading-1">{children}</h1>,
    h2: ({ children }) => <h2 className="heading-2">{children}</h2>,
    h3: ({ children }) => <h3 className="heading-3">{children}</h3>,
    normal: ({ children }) => <p className="mt-6 font-sans">{children}</p>,
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
  images?: {
    asset?: { url: string }
    alt?: string
    credit?: string
  }[]
}

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

  const firstImage = folio.images?.[0]

const viewFullShootButton = (
  <Link href={`/folio/gallery/${folio.slug}/full`}>
    <p className="w-full text-left mt-7 mb-7 md:text-center place-self-end md:mb-0 md:mt-4 uppercase text-sm hover:underline">
      View Full Shoot
    </p>
  </Link>
)

  return (
    <>
      <div className="my-12 p-6 pt-0 lg:p-0 lg:-my-0 lg:pr-7.5 lg:grid lg:grid-cols-2 min-h-screen">
        <div className="overflow-y-scroll lg:min-h-screen lg:pt-54 lg:py-24 lg:px-30 scrollbar-hide">
          <header className="md:pb-6">
            <h1 className="heading-1 text-justify">
              {folio.title ?? "Untitled"}
            </h1>
            {folio.subtitle && (
              <p className="text-lg text-gray-600 mt-2">{folio.subtitle}</p>
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
        </div>

        <div className="block md:hidden">{viewFullShootButton}</div>

        <div className="lg:flex lg:flex-col lg:justify-center lg:pl-24">
          {firstImage?.asset?.url && (
            <Link href={`/folio/gallery/${folio.slug}/full`} className="block group">
              <div className="relative w-full flex justify-center items-center">
                <Image
                  src={firstImage.asset.url}
                  alt={firstImage.alt || folio.title || ""}
                  width={800}
                  height={600}
                  className="object-contain w-auto md:max-h-[50vh]"
                />
              </div>
              {firstImage.credit && (
                <p className="text-sm text-gray-500 mt-2">{firstImage.credit}</p>
              )}
         
            </Link>
          )}
          <div className="hidden md:block">{viewFullShootButton}</div>
        </div>
      </div>
      <nav className="fixed bottom-5 pl-6 lg:pl-16 uppercase">
        <Link href="/folio" className="hover:underline text-[14px] text-black mix-blend-difference">
          Folio
        </Link>
      </nav>
    </>
  )
}
