import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import { videoQuery, videoSlugsQuery } from "@/sanity/lib/queries"
import Gallery, { GalleryImage } from "@/app/components/Gallery"
import Submit from "@/app/components/Submit"

// Re-fetch from Sanity at most once per minute so content edits appear without a redeploy
export const revalidate = 60

interface VideoStills {
  _id: string
  title?: string
  images?: GalleryImage[]
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data } = await sanityFetch({
    query: videoSlugsQuery,
    perspective: "published",
    stega: false,
  })
  return (data || []).map((item: any) => ({ slug: String(item.slug) }))
}

/** Stills from a video, shown in the same carousel the galleries use. Reached
 *  from the "View Stills" link on the video page, which only appears when the
 *  video actually has stills. */
export default async function VideoStillsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data } = await sanityFetch({
    query: videoQuery,
    params: { slug },
  })

  const video = data as VideoStills | null
  if (!video?._id) return notFound()
  // A video with no stills has no page here — better a 404 than an empty frame
  // for anyone who reaches the URL directly.
  if (!video.images?.length) return notFound()

  return (
    <>
      <Submit />
      <div className="relative h-full lg:pt-6 xl:pt-0 lg:pl-20 lg:pr-5">
        <div className="">
          <Gallery images={video.images} title={video.title} />
        </div>
      </div>
    </>
  )
}
