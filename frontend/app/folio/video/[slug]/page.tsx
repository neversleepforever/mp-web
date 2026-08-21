import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { PortableText } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { videoSlugsQuery, videoQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Link from "next/link"
import MuxPlayer from "@mux/mux-player-react"
import TextDistortFilter from "@/app/components/TextFilter"
import Gallery, { GalleryImage } from "@/app/components/Gallery"
import { getNextFolioHref } from "@/app/folio/nextFolio"
import DontStopCta from "@/app/components/DontStopCta"

export interface Video {
  _id: string
  title?: string
  subtitle?: string
  photographer?: string
  date?: string
  slug: string
  description?: any[]
  videoUrl?: string
  muxVideo?: {
    asset?: {
      playbackId?: string
      assetId?: string
      status?: string
    }
  }
  caption?: string
  images?: unknown[]
}

export const revalidate = 60

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data } = await sanityFetch({
    query: videoSlugsQuery,
    perspective: "published",
    stega: false,
  })
  return (data || []).map((item: any) => ({
    slug: String(item.slug),
  }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params

  const { data } = await sanityFetch({
    query: videoQuery,
    params: { slug },
    stega: false,
  })

  const video = data as Video | null
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = video?.videoUrl
    ? { url: `https://img.youtube.com/vi/${video.videoUrl}/hqdefault.jpg` }
    : video?.muxVideo?.asset?.playbackId
    ? { url: `https://image.mux.com/${video.muxVideo.asset.playbackId}/thumbnail.png` }
    : null

  return {
    title: video?.title ?? "Untitled",
    description:
      video?.subtitle ||
      video?.description?.[0]?.children?.[0]?.text ||
      undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  }
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data } = await sanityFetch({
    query: videoQuery,
    params: { slug },
  })

  const video = data as Video | null
  if (!video?._id) return notFound()

  // Rendered here rather than in the Footer: the Footer only knows the pathname,
  // so it can't tell whether this video has stills, and a link to an empty
  // gallery is worse than no link.
  const hasStills = Boolean(video.images?.length)
  const stillsHref = `/folio/video/${video.slug}/full`
  const nextHref = await getNextFolioHref("video", slug)

  return (
    <>
      <div className="my-12 md:my-16 p-6 md:p-0 pt-0">
  <div className="gallery-lock-hide md:px-20 lg:px-30 pb-8 scrollbar-hide">
          <TextDistortFilter>
            <header className="pb-6">
              <h1 className="heading-1 text-justify">
                {video.title ?? "Untitled"}
              </h1>
              {video.subtitle && (
                <p className="text-lg text-gray-600">{video.subtitle}</p>
              )}
              <div className="mt-8 text-[18px] font-extrabold mb-3">
                {video.date && (
                  <p className="uppercase font-sans text-[18px]">
                    {new Date(video.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {video.photographer && (
                  <div className="uppercase font-nav text-[12px]">{video.photographer}</div>
                )}
              </div>
            </header>
            <div className="text-[22px]">
              {video.description?.length ? (
                <PortableText value={video.description} />
              ) : null}
            </div>
          </TextDistortFilter>
        </div>

       {/* Mobile: trailer and stills as one carousel, the video leading. Desktop
           keeps the trailer as a cover with a "View Stills" link instead. */}
       {/* No stills: the trailer alone becomes the locked viewer at xg, so
           these pages lock, get Submit/Info/Don't Stop, and behave like every
           other project page. Below xg the plain player further down renders
           instead. */}
       {video.muxVideo?.asset?.playbackId && !hasStills && (
         <div className="w-full hidden xg:block">
           <Gallery
             images={[]}
             title={video.title}
             leadVideo={{ playbackId: video.muxVideo.asset.playbackId }}
             deskLock
             nextHref={nextHref ?? undefined}
           />
         </div>
       )}

       {video.muxVideo?.asset?.playbackId && hasStills && (
         <div className="w-full">
           <Gallery
             images={video.images as GalleryImage[]}
             title={video.title}
             leadVideo={{ playbackId: video.muxVideo.asset.playbackId }}
             deskLock
             nextHref={nextHref ?? undefined}
           />
         </div>
       )}

       {video.muxVideo?.asset?.playbackId ? (
  <div className={`w-full xl:h-[100vh] md:px-20 lg:px-30 xl:p-30 flex-col items-center justify-center ${hasStills ? "hidden" : "flex xg:hidden"}`}>
    <MuxPlayer
      playbackId={video.muxVideo.asset.playbackId}
      streamType="on-demand"
      autoPlay={false}
      className="w-full object-contain xl:max-h-[80vh]"
    />
    {video.caption && (
      <div className="w-full pb-12 xl:pb-0">
        <TextDistortFilter>
          <p className="mt-7 font-sans w-full text-left">
            {video.caption}
          </p>
        </TextDistortFilter>
      </div>
    )}
  </div>
) : (
  <p className="text-gray-500 italic">No video available</p>
)}
      </div>
      {/* The only link to the stills, at every size. Sits where the galleries put
          "View Full Shoot" and matches the footer's padding so the two line up —
          and above it, since the footer is a full-width fixed bar at z-40 that
          would otherwise swallow the click. */}
      {hasStills && (
        <div className="hidden fixed bottom-0 right-0 py-4 px-7 z-50">
          <TextDistortFilter>
            <Link
              href={stillsHref}
              className="uppercase hover:underline text-[12px] text-black mix-blend-difference"
            >
              View Stills
            </Link>
          </TextDistortFilter>
        </div>
      )}
      {nextHref && <DontStopCta href={nextHref} />}
    </>
  )
}