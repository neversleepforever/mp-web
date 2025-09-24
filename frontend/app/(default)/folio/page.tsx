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
    <div className="h-[85vh] pl-6 pr-6 md:pr-0 my-12 md:my-18">
      <div
        className="
          grid gap-6
          md:grid-rows-2 md:grid-flow-col
          md:overflow-x-auto md:scroll-smooth
          h-full
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
              className="flex flex-col md:min-w-[35vw] lg:min-w-[300px] h-full"
            >
              {previewImage ? (
                <div className="flex-1 relative">
                  <div className="absolute inset-0">
                    <Image
                      src={previewImage}
                      alt={folio.title || folio.displayImage?.alt || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 300px"
                    />
                  </div>
                  <div className="pt-[125%]" /> {/* maintain 4/5 aspect ratio */}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-600 italic">{folio._type}</span>
                </div>
              )}

              <div className="mt-2">
                <h2>{folio.title ?? "Untitled"}</h2>
                {/* <p className="text-sm text-gray-500">{folio._type}</p> */}
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
