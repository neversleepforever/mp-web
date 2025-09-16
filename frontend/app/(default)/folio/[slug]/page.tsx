import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { PortableText } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { folioPagesSlugs, folioQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Gallery from "./Gallery"

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

  if (!folio?._id) {
    return notFound()
  }

  return (
    <div className="my-12 lg:my-24 p-6">
      <header className="border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {folio.title ?? "Untitled"}
        </h1>
        {folio.subtitle && (
          <p className="text-lg text-gray-600 mt-2">{folio.subtitle}</p>
        )}
        <div className="mt-4 text-sm text-gray-500">
          <span>{folio.photographer ?? "Unknown photographer"}</span>
          {folio.date && <> · <span>{folio.date}</span></>}
        </div>
      </header>

      {folio.description?.length ? (
        <PortableText
          // className="prose prose-lg max-w-2xl"
          value={folio.description}
        />
      ) : null}

      {folio.images?.length ? (
        <Gallery images={folio.images} title={folio.title} />
      ) : null}
    </div>
  )
}
