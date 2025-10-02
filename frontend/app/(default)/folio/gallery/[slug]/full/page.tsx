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

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data } = await sanityFetch({
    query: folioPagesSlugs,
    perspective: "published",
    stega: false,
  })
  return (data || []).map((item: any) => ({ slug: String(item.slug) }))
}

export default async function FullShootPage({
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
