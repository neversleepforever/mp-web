import { HeroVignette } from "@/app/components/Vignette"
import ScrollSwapHero from "@/app/components/ScrollSwapHero"
import { sanityFetch } from "@/sanity/lib/live"
import { bookingsQuery } from "@/sanity/lib/queries"
import JotformEmbed from "../components/JotFormEmbed"

// Re-fetch from Sanity at most once per minute so content edits appear without a redeploy
export const revalidate = 60

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
  imageSecondary?: BookingImage
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
  const heroSrc = heroAsset?.url || ""
  const heroAlt = heroImage?.alt || "Cover Image"

  // Optional second hero: when set in the Studio, the md+ hero swaps to it once
  // the form is scrolled past halfway. The Jotform iframe never scrolls
  // internally — it's sized to the form's full height by Jotform's setHeight
  // postMessage, so this column is the real scroll container, and the swap
  // reads fresh measurements per event as the form loads and reflows.
  const secondAsset = booking.imageSecondary?.asset
  const secondSrc = secondAsset?.url || ""

  return (
    <>
      <div className="md:grid md:grid-cols-2 dark:text-white bg-[#454545] h-[calc(100dvh_-_var(--announcement-h,0px))]">
        <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-[#0b0b0b] bg-[url('/images/scantexture.jpg')] bg-cover bg-center md:h-[calc(100dvh_-_var(--announcement-h,0px))] md:p-8">
          {secondSrc ? (
            <ScrollSwapHero
              images={[
                { src: heroSrc, alt: heroAlt, blurDataURL: heroAsset?.metadata?.lqip },
                {
                  src: secondSrc,
                  alt: booking.imageSecondary?.alt || heroAlt,
                  blurDataURL: secondAsset?.metadata?.lqip,
                },
              ]}
              scrollContainerId="bookings-content-scroll"
              uidPrefix="booking-hero-desktop"
              mode="wipe"
              variant="rose"
              className="aspect-[480/910] w-full max-w-[340px] lg:max-w-[calc(77dvh_*_480_/_910)]"
            />
          ) : (
            <HeroVignette
              src={heroSrc}
              alt={heroAlt}
              blurDataURL={heroAsset?.metadata?.lqip}
              uid="booking-hero-desktop"
              variant="rose"
              className="aspect-[480/910] w-full max-w-[340px] lg:max-w-[calc(77dvh_*_480_/_910)]"
            />
          )}
        </div>
        {/* Mobile background is the fence alone over near-black — the grey
            scantexture layer is parked, matching About and Services. */}
        <div id="bookings-content-scroll" className="relative scrollbar-hide bg-[#0b0b0b] bg-cover bg-center md:bg-none md:col-start-2 h-[calc(100dvh_-_var(--announcement-h,0px))] overflow-y-auto pt-[56px] pb-12 md:px-6 md:pt-4 xl:px-26">
            <div className="relative z-10">
                <JotformEmbed formId="250685995022262"/>
            </div>
            </div>
      </div>
    </>
  )
}
