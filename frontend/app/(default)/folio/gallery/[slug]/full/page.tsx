// app/folio/gallery/[slug]/full/page.tsx
import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import { folioQuery, folioPagesSlugs } from "@/sanity/lib/queries"
import Gallery from "../../../../../components/Gallery"

export interface Folio {
  _id: string
  title?: string
  slug: string
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

export default async function FullShootPage({ params }: Props) {
  const { data } = await sanityFetch({
    query: folioQuery,
    params,
  })

  const folio = data as Folio | null
  if (!folio?._id) return notFound()

  return (
    <div className="relative min-h-screen">
      <div className="p-6 md:p-12">

        {folio.images?.length ? (
          <Gallery images={folio.images} title={folio.title} />
        ) : (
          <p>No images found for this shoot.</p>
        )}
      </div>
    </div>
  )
}
