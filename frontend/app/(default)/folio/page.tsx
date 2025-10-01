import Link from "next/link"
import Image from "next/image"
import { sanityFetch } from "@/sanity/lib/live"
import { allFoliosQuery } from "@/sanity/lib/queries"

type FolioListItem = {
  _id: string
  _type: "gallery" | "journal" | "video"
  title?: string
  subtitle?: string
  photographer?: string
  date?: string
  slug: string
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
   <div className="h-[100vh] md:px-6 md:pt-16 overflow-y-auto">
  <div
     className="
          grid gap-3
          md:pb-6
          md:grid-cols-3 lg:grid-cols-5 lg:pb-0
          md:[grid-template-rows:repeat(2,_minmax(0,_42vh))]
          md:auto-rows-[minmax(0,_42vh)]
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
          {/* Image fills available space */}
          {previewImage ? (
            <div className="relative flex-1">
              <Image
                src={previewImage}
                alt={folio.title || folio.displayImage?.alt || ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (min-width: 768px) 20vw"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-200">
              <span className="text-gray-600 italic">{folio._type}</span>
            </div>
          )}

          {/* Text only takes as much height as it needs */}
          <div className="mt-2">
            <h2>{folio.title ?? "Untitled"}</h2>
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
        </Link>
      )
    })}
  </div>
</div>

  )
}
