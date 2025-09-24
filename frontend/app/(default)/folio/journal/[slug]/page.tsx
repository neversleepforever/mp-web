import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { PortableText } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { journalSlugsQuery, journalQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Link from "next/link"
import Image from "next/image"

export interface Journal {
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

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: journalSlugsQuery,
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
    query: journalQuery,
    params,
    stega: false,
  })

  const journal = data as Journal | null
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = journal?.images?.[0]
    ? resolveOpenGraphImage(journal.images[0])
    : null

  return {
    title: journal?.title ?? "Untitled",
    description:
      journal?.subtitle ||
      journal?.description?.[0]?.children?.[0]?.text ||
      undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  }
}

export default async function JournalPage({ params }: Props) {
  const { data } = await sanityFetch({
    query: journalQuery,
    params,
  })

  const journal = data as Journal | null
  if (!journal?._id) return notFound()

  return (
    <div className="my-12 lg:my-24 p-6">
      <header className="pb-6">
        <h1 className="text-[38px] font-bold tracking-tight text-gray-900">
          {journal.title ?? "Untitled"}
        </h1>
        {journal.subtitle && (
          <p className="text-lg text-gray-600 mt-2">{journal.subtitle}</p>
        )}
        <div className="mt-8 text-[18px]">
          {journal.photographer && (
            <div className="uppercase">Shot By {journal.photographer}</div>
          )}
          {journal.date && <div>{journal.date}</div>}
        </div>
      </header>

      <div className="text-[22px]">
        {journal.description?.length ? (
          <PortableText value={journal.description} />
        ) : null}
      </div>

      {journal.images?.length ? (
        <section className="grid gap-8 mt-8">
          {journal.images.map(
            (img, i) =>
              img?.asset?.url && (
                <figure key={i} className="flex flex-col gap-2">
                  <Image
                    src={img.asset.url}
                    alt={img.alt || journal.title || ""}
                    width={1000}
                    height={1200}
                    className="rounded-lg shadow object-contain"
                  />
                  {img.credit && (
                    <figcaption className="text-sm text-gray-500">
                      {img.credit}
                    </figcaption>
                  )}
                </figure>
              )
          )}
        </section>
      ) : null}

      <nav className="fixed bottom-7 uppercase mix-blend-difference z-90">
        <Link href="/folio" className="hover:underline text-[14px]">
          Folio
        </Link>
      </nav>
    </div>
  )
}
