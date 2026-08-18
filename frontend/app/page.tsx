import { sanityFetch } from "@/sanity/lib/live"
import { allFoliosQuery } from "@/sanity/lib/queries"
import TextDistortFilter from "@/app/components/TextFilter"
import { urlFor } from "@/sanity/lib/imageBuilder"
import FadeInImage from "@/app/components/FadeInImage"
import { TransitionLink } from "@/app/components/TransitionLink"

// The folio grid IS the landing page — it used to live at /folio with `/`
// redirecting to it; /folio now permanently redirects here instead, so old
// links keep working. Project pages stay under /folio/gallery|journal|video.
// (The magazine-cover landing page this replaced is in git history: f44e41a.)

// Re-fetch from Sanity at most once per minute so content edits appear without a redeploy
export const revalidate = 60

type ImageAsset = {
  _id: string
  metadata?: {
    lqip?: string
    dimensions?: {
      width: number
      height: number
    }
  }
}

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
    alt?: string
    credit?: string
    asset?: ImageAsset
  }[]

  displayImage?: {
    alt?: string
    asset?: ImageAsset
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
        h-[calc(100dvh_-_var(--announcement-h,0px))] px-6 pt-12 pb-16
        overflow-y-auto overflow-x-hidden scrollbar-hide
        md:overflow-x-auto md:overflow-y-hidden md:py-16
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
          const firstImg = folio.displayImage
          const asset = firstImg?.asset
          const alt = firstImg?.alt || folio.title || ""
          const previewImage = asset ? urlFor(asset).width(1200).fit("max").url() : null

          return (
            <TransitionLink
              key={folio._id}
              href={`/folio/${folio._type}/${folio.slug}`}
              className="flex flex-col h-full"
            >
              {previewImage ? (
                <div className="relative w-full aspect-[4/5] md:h-[421px] md:w-[300px] xl:w-auto xl:h-auto overflow-hidden">
                  <FadeInImage
                    src={previewImage}
                    alt={alt}
                    fill
                    sizes="(min-width: 1280px) 380px, (min-width: 768px) 300px, 100vw"
                    placeholder={asset?.metadata?.lqip ? "blur" : "empty"}
                    blurDataURL={asset?.metadata?.lqip}
                    className="object-cover object-center "
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-600 italic">{folio._type}</span>
                </div>
              )}

              <TextDistortFilter>
                {/* The cover mockups carry ~4% transparent margin on each side,
                    so text flush to the image box sits left of the visible cover
                    edge. Padding by percentage rather than pixels keeps it
                    aligned as the tile resizes across breakpoints. */}
                <div className="mt-2 pl-[4.2%] font-nav text-[12px] uppercase">
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
            </TransitionLink>
          )
        })}
        <div className="hidden md:block w-6 xl:hidden" />
      </div>
    </div>
  )
}
