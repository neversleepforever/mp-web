import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { PortableText } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { videoSlugsQuery, videoQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Link from "next/link"
import MuxPlayer from "@mux/mux-player-react"

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
}


type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: videoSlugsQuery,
    perspective: "published",
    stega: false,
  })
  return data as { slug: string }[]
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: videoQuery,
    params,
    stega: false,
  })

  const video = data as Video | null
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = video?.videoUrl
    ? { url: `https://img.youtube.com/vi/${video.videoUrl}/hqdefault.jpg` }
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

export default async function VideoPage({ params }: Props) {
  const { data } = await sanityFetch({
    query: videoQuery,
    params,
  })

  const video = data as Video | null
  if (!video?._id) return notFound()
    console.log(video)

  return (
    <div className="my-12 lg:my-24 p-6">
      <header className="pb-6">
        <h1 className="text-[38px] font-bold tracking-tight text-gray-900">
          {video.title ?? "Untitled"}
        </h1>
        {video.subtitle && (
          <p className="text-lg text-gray-600 mt-2">{video.subtitle}</p>
        )}
        <div className="mt-8 text-[18px]">
          {video.photographer && (
            <div className="uppercase">Shot By {video.photographer}</div>
          )}
          {video.date && <div>{video.date}</div>}
        </div>
      </header>

      <div className="text-[22px]">
        {video.description?.length ? (
          <PortableText value={video.description} />
        ) : null}
      </div>
    {video.muxVideo?.asset?.playbackId ? (
        <MuxPlayer
            playbackId={video?.muxVideo?.asset?.playbackId}
            streamType="on-demand"
            autoPlay={false}
            // controls
            className="w-full h-full object-contain"
        />
        ) : video.videoUrl ? (
        <video
            src={video.videoUrl}
            controls
            className="w-full h-full object-contain"
        />
        ) : (
        <p className="text-gray-500 italic">No video available</p>
        )}
      <nav className="fixed bottom-7 uppercase mix-blend-difference z-90">
        <Link href="/folio" className="hover:underline text-[14px]">
          Folio
        </Link>
      </nav>
    </div>
  )
}
