import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import { folioQuery, folioPagesSlugs } from "@/sanity/lib/queries"
import Gallery from "../../../../components/Gallery"
import Submit from "@/app/components/Submit"
import { GalleryImage } from "@/app/components/Gallery"

export interface Folio {
  _id: string
  title?: string
  slug: string
  images?: GalleryImage[]
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
    <Submit />
    <div className="relative h-[100dvh] lg:pt-6 xl:pt-0 lg:pl-20 lg:pr-5">
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
