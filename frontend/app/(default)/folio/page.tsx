import Link from "next/link"
import Image from "next/image"
import { sanityFetch } from "@/sanity/lib/live"
import { allFoliosQuery } from "@/sanity/lib/queries"
import TextDistortFilter from "@/app/components/TextFilter"

type FolioListItem = {
  _id: string
  _type: "gallery" | "journal" | "video"
  title?: string
  subtitle?: string
  photographer?: string
  date?: string
  slug: string
  displayTitle: string
  images?: {
    asset?: { url: string }
    credit?: string
  }[]
  displayImage?: {
    asset?: { url: string }
    alt?: string
  }
}

export default async function FolioIndexPage() {
  const { data } = await sanityFetch({
    query: allFoliosQuery,
  })

  const folios = data as FolioListItem[]

  if (!folios?.length) {
    return <p>No folios found.</p>
  }

  return (
  <div
  className="
    h-[100vh] px-6 py-12 
    overflow-y-auto overflow-x-hidden 
    md:overflow-x-auto md:overflow-y-hidden md:pt-16
    xl:overflow-x-hidden xl:overflow-y-auto xl:pb-0
  "
  >
  <div
     className="
          grid gap-3 grid-cols-1 auto-rows-max scrollbar-hide
          md:grid-cols-none md:grid-rows-2 md:auto-cols-max md:grid-flow-col md:snap-x md:snap-mandatory md:h-full 
          xl:grid-rows-none xl:grid-flow-row xl:grid-cols-5 xl:grid-rows-[repeat(2,_minmax(0,_1fr))] xl:grid-flow-row xl:overflow-y-auto xl:pb-16 
        "
  >
      {folios.map((folio) => {
      const previewImage =
        folio._type === "video"
          ? folio.displayImage?.asset?.url
          : folio.images?.[0]?.asset?.url

      return (
        <Link
          key={folio._id}
          href={`/folio/${folio._type}/${folio.slug}`}
          className="flex flex-col h-full"
        >
          {previewImage ? (
            <div className="relative w-full aspect-[4/5] md:h-[421px] md:w-[300px] xl:w-auto xl:h-auto overflow-hidden">
              <Image
                src={previewImage}
                alt={folio.title || ""}
                fill
                className="object-cover object-center"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-200">
              <span className="text-gray-600 italic">{folio._type}</span>
            </div>
          )}
          <TextDistortFilter>
          <div className="mt-2 font-nav text-[12px] uppercase">
            <h2>{folio.displayTitle ?? "Untitled"}</h2>
            {folio.date && (
              <p>
                {new Date(folio.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
          </TextDistortFilter>
        </Link>
      )
    })}
  </div>
</div>

  )
}
