import Link from "next/link"
import Image from "next/image"
import { sanityFetch } from "@/sanity/lib/live"
import { allFoliosQuery } from "@/sanity/lib/queries"

type FolioListItem = {
  _id: string
  title?: string
  subtitle?: string
  photographer?: string
  date?: string
  slug: string
  images?: {
    asset?: { url: string }
    credit?: string
  }[]
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
    <div className="container p-6 pt-14 pb-14">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {folios.map((folio) => (
          <Link
            key={folio._id}
            href={`/folio/${folio.slug}`}
            className="block"
          >
            {folio.images?.[0]?.asset?.url && (
              <div className="mb-4">
                <Image
                  src={folio.images[0].asset.url}
                  alt={folio.title || ""}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <h2 className="">{folio.title ?? "Untitled"}</h2>
            {/* {folio.subtitle && (
              <p className="text-gray-600 text-sm">{folio.subtitle}</p>
            )} */}
            <p className="">
              {/* {folio.photographer ?? "Unknown"}{" "} */}
              {folio.date && new Date(folio.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
