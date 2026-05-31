import FadeInImage from "@/app/components/FadeInImage"
import { sanityFetch } from "@/sanity/lib/live"
import { bookingsQuery } from "@/sanity/lib/queries"
import JotformEmbed from "../components/JotFormEmbed"
import TextDistortFilter from "@/app/components/TextFilter"

type ImageAsset = {
  _id: string
  url?: string
  metadata?: {
    lqip?: string
    dimensions?: {
      width: number
      height: number
    }
  }
}

interface BookingImage {
  alt?: string
  asset?: ImageAsset
}

interface BookingData {
  _id: string
  image?: BookingImage
}

export default async function BookingPage() {
  const { data } = await sanityFetch({
    query: bookingsQuery,
    perspective: "published",
  })

  const booking = data as BookingData | null

  if (!booking) {
    return <p>No Booking content found. Add it in Sanity Studio.</p>
  }

  const heroImage = booking.image
  const heroAsset = heroImage?.asset

  return (
    <>
      <div className="md:grid md:grid-cols-2 dark:text-white bg-[#454545] h-[100dvh]">
        <div className="hidden md:block relative w-full h-full">
          <FadeInImage
            src={heroAsset?.url || ""}
            alt={heroImage?.alt || ""}
            blurDataURL={heroAsset?.metadata?.lqip}
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="relative bg-[#0b0b0b] bg-[url('/images/scantexture.jpg')] bg-cover bg-center md:col-start-2 h-[100dvh] flex flex-col pt-0 md:px-6 md:py-12 xl:px-26">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/book-bg-texture.svg')] bg-cover bg-center" />
            <TextDistortFilter className="relative z-10 flex-1 flex flex-col">
                <JotformEmbed formId="250685995022262"/>
            </TextDistortFilter>
            </div>
      </div>
    </>
  )
}