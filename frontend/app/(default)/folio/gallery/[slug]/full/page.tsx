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
    <>
     <div className="fixed inset-0 z-0 md:hidden pointer-events-none">
        <div className="w-full h-full bg-[url('/images/centerfoldmobilelight.png')] bg-cover bg-center" />
      </div>
      <div className="md:fixed md:inset-0 md:z-0 md:pointer-events-none">
        <div className="md:w-auto md:h-screen md:bg-[url('/images/centerfoldmedium.png')] md:bg-center md:bg-no-repeat md:bg-contain" />
      </div>
    <div className="relative min-h-screen">
      <div className="">
        {folio.images?.length ? (
          <Gallery images={folio.images} title={folio.title} />
        ) : (
          <p>No images found for this shoot.</p>
        )}
      </div>
    </div>
    </>
  )
}
