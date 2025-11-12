import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { PortableText } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { videoSlugsQuery, videoQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Link from "next/link"
import MuxPlayer from "@mux/mux-player-react"
import TextDistortFilter from "@/app/components/TextFilter"

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
}

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

  return (
      <>
      <div className="my-12 px-6 md:px-21 py-0 xl:p-0 xl:-my-0 xl:grid xl:grid-cols-2 h-screen">
        <div className="xl:min-h-screen lg:pt-54 xl:pb-24 xl:px-30 xl:overflow-y-scroll scrollbar-hide ">
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

      {video.muxVideo?.asset?.playbackId ? (
        <div className="relative w-full pt-16 pb-16 lg:mt-0 md:h-[75vh] xl:h-[100vh] xl:px-16 xl:px-30 flex flex-col items-center justify-center">
          <MuxPlayer
            playbackId={video.muxVideo.asset.playbackId}
            streamType="on-demand"
            autoPlay={false}
            className="w-full object-contain"
          />
        
          {video.caption && (
  
              <div className="w-full">
                <TextDistortFilter>
                  <p className="mt-7 font-sans w-full text-left">
                    {video.caption}
                  </p>
                </TextDistortFilter>
              </div>
          )}

        </div>
      ) 
      // : video.videoUrl ? (
      //   <video
      //     src={video.videoUrl}
      //     controls
      //     className="w-full object-contain"
      //   />
      // ) 
      : (
        <p className="text-gray-500 italic">No video available</p>
      )}
    </div>
    </>
  )
}
