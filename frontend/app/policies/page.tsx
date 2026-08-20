import type { Metadata } from "next"
import TextDistortFilter from "@/app/components/TextFilter"
import { HeroVignette, ContentVignette } from "@/app/components/Vignette"
import ScrollSwapHero from "@/app/components/ScrollSwapHero"
import FaqAccordion, { type FaqItem } from "@/app/components/FaqAccordion"
import { PortableText, type PortableTextComponents } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { policiesQuery, servicesQuery } from "@/sanity/lib/queries"

export const metadata: Metadata = {
  title: "Policies & FAQs",
  description: "Session policies, screening, and frequently asked questions.",
}

export const revalidate = 60

// Content lives in the Sanity "policies" singleton; everything hardcoded
// below is the fallback that renders until the Studio document is filled in
// (and stays as a safety net if it's ever emptied).

type Block = { p?: string; bullets?: string[]; spacer?: boolean }
type PolicySection = { title: string; blocks: Block[] }

const POLICIES_A: PolicySection[] = [
  {
    title: "Deposits",
    blocks: [
      { p: "A 50% deposit secures in-person sessions. Virtual sessions require 100% tribute before we begin." },
      { p: "Deposit methods are shared privately once your application is accepted; session details aren’t discussed before deposit clears." },
      { p: "If I have to cancel for any reason, your deposit is returned promptly or applied to a rescheduled time, your choice." },
    ],
  },
  {
    title: "Booking Notice",
    blocks: [
      { p: "Minimum 48 hours notice for in-person sessions. Same-day requests are rarely accommodated. For cities I’m travelling to, please apply at least one week in advance." },
    ],
  },
  {
    title: "Cancellation & Rescheduling",
    blocks: [
      { p: "Tell me as early as you can if your schedule has shifted, and I’ll do the same." },
      { spacer: true },
      {
        bullets: [
          "48+ hours notice: deposit transfers to a rescheduled session.",
          "Less than 48 hours: deposit is forfeit, and a new one is required to rebook.",
          "Less than 24 hours, or no-show: full session fee is due. Future bookings require a new deposit.",
        ],
      },
    ],
  },
  {
    title: "Screening",
    blocks: [
      { p: "Before any in-person session, I require one of the following:" },
      {
        bullets: [
          "Photo ID showing your name and date of birth (other details may be obscured).",
          "A verifiable professional site (LinkedIn, company directory) clearly showing your full name and photo, plus a brief email sent to me from the work address tied to that site so I can confirm the link is yours.",
          "A reference from another professional provider you have seen within the last twelve months.",
        ],
      },
      { spacer: true },
      { p: "This is a hard requirement. Information is held privately and never shared." },
    ],
  },
]

const POLICIES_B: PolicySection[] = [
  {
    title: "Preparation",
    blocks: [
      { p: "Arrive fresh and well-fed. If specific preparation is needed for what we’ve agreed to, I’ll let you know in advance." },
    ],
  },
  {
    title: "Punctuality",
    blocks: [
      { p: "Sessions begin and end at the agreed time. If you arrive late, our time runs from the original start. In the unlikely event I’m running late, the missing minutes are added to the end or applied to your next session, as you wish." },
    ],
  },
  {
    title: "Hard Limits",
    blocks: [{ p: "Scat and Roman showers." }],
  },
  {
    title: "Discretion & Recording",
    blocks: [
      { p: "Photos and recording during sessions are not permitted unless agreed in writing in advance. Discretion runs both ways: yours is protected as carefully as mine." },
    ],
  },
  {
    title: "Information Handling",
    blocks: [
      { p: "Anything you submit through screening or the application form is held privately, used only to verify identity and prepare for our time together, and never shared, sold, or kept beyond what’s needed." },
    ],
  },
  {
    title: "Communication",
    blocks: [
      { p: "Response time is up to 48 hours. If a week passes with no reply, you may follow up once. Please check your junk folder first." },
      { spacer: true },
      { p: "Once a session is confirmed and deposit is received, session details and logistics are handled through the channel I’ve shared with you, and never through DMs on social." },
    ],
  },
  {
    title: "FMTY (Fly Me to You)",
    blocks: [
      { p: "I take FMTY bookings. Travel and accommodation are at your expense and arranged in advance. These are bespoke by nature; please inquire." },
    ],
  },
  {
    title: "Honorifics",
    blocks: [
      { p: "You may address me as Mistress, Mistress Maggie, Maggie Peach, Miss Maggie, or Miss Peach. Other titles may be earned through ongoing dynamics." },
    ],
  },
  {
    title: "Gifts & Tips",
    blocks: [
      { p: "Tips above the agreed tribute are welcomed and remembered. My Throne wishlist lives on the Contact page; favourites include latex and leather (size XS), shoes (size 6), spa services, coffee and flowers." },
    ],
  },
]

const FAQS: FaqItem[] = [
  {
    question: "Where do you session from?",
    answer: "Incall is held in a private Toronto dungeon. For outcall, you book a 4- or 5-star hotel, or another location I’ve approved in advance.",
  },
  {
    question: "I’m new to this. Can I still apply?",
    answer: "First-timers are most welcome. Some of my favourite ongoing dynamics started with someone who’d never seen a Pro-Domme. Be honest about that on the form so I can hold our time accordingly. If a full session feels like too much to begin with, a social date is a gentler way to meet first; some clients book a social followed by a session as a way to ease in.",
  },
  {
    question: "What’s the shortest session you take?",
    answer: "Ninety minutes for in-person; thirty minutes for virtual. Longer bookings are preferred and prioritised.",
  },
  {
    question: "Do you travel?",
    answer: "Yes. See FMTY above. Tour cities are announced on Tryst and on my socials.",
  },
  {
    question: "Do you see couples?",
    answer: "Yes, I very much enjoy seeing couples and other configurations of people in relationship. The session is shaped around your shared desires. Apply individually, and note in the form that you’re inquiring as a couple.",
  },
  {
    question: "Can I make outfit requests?",
    answer: "You may ask. Note any wardrobe interests in the form, politely, and if your request aligns with my own taste, I may oblige.",
  },
  {
    question: "How do I see your creative work, or book editorial?",
    answer: "Selected past work lives on the Folio page. For editorial, performance, film, and custom content inquiries, see the bottom of the Services page.",
  },
]

/** Black title bar opening a boxed group (POLICIES / FAQs). */
function HeaderBar({ label }: { label: string }) {
  return (
    <div className="bg-black px-[30px] py-[24px]">
      <TextDistortFilter>
        <h2 className="font-display font-extrabold text-[40px] leading-[37px] text-white uppercase text-justify">
          {label}
        </h2>
      </TextDistortFilter>
    </div>
  )
}

/** One bordered policy box. `boxTop` gives the box its own top rule — needed on
 *  the first box after an image frame, where there's no box above to borrow a
 *  bottom border from. */
function PolicyBox({ section, boxTop = false }: { section: PolicySection; boxTop?: boolean }) {
  return (
    <section
      className={`${boxTop ? "border-2" : "border-b-2 border-l-2 border-r-2"} border-black border-solid px-[30px] py-[24px]`}
    >
      <TextDistortFilter>
        <div className="flex flex-col gap-[26px] text-[22px] text-black text-justify">
          <h3 className="font-display font-extrabold uppercase leading-[normal]">
            {section.title}
          </h3>
          <div className="font-sans leading-[normal]">
            {section.blocks.map((block, i) => {
              if (block.spacer) return <div key={i} className="h-[22px]" />
              if (block.bullets)
                return (
                  <ul key={i} className="list-disc ps-[33px]">
                    {block.bullets.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                )
              return <p key={i}>{block.p}</p>
            })}
          </div>
        </div>
      </TextDistortFilter>
    </section>
  )
}

type CmsImage = {
  alt?: string | null
  asset?: {
    url?: string | null
    metadata?: { lqip?: string | null; dimensions?: { width?: number | null; height?: number | null } | null } | null
  } | null
}
type CmsSection =
  | { _type: "policySection"; _key: string; title?: string | null; body?: any[] | null }
  | ({ _type: "image"; _key: string } & CmsImage)
type PoliciesData = {
  image?: CmsImage | null
  imageSecondary?: CmsImage | null
  imageTertiary?: CmsImage | null
  sections?: CmsSection[] | null
  faqs?: { _key: string; question?: string | null; answer?: string | null }[] | null
} | null

/** Policy body blocks from Sanity, styled like the hardcoded stack: contiguous
 *  paragraphs (an empty block reads as the spacer line), disc bullets. */
const policyBodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-[normal]">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ps-[33px]">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
}

function CmsPolicyBox({
  title,
  body,
  boxTop = false,
}: {
  title?: string | null
  body?: any[] | null
  boxTop?: boolean
}) {
  return (
    <section
      className={`${boxTop ? "border-2" : "border-b-2 border-l-2 border-r-2"} border-black border-solid px-[30px] py-[24px]`}
    >
      <TextDistortFilter>
        <div className="flex flex-col gap-[26px] text-[22px] text-black text-justify">
          <h3 className="font-display font-extrabold uppercase leading-[normal]">{title}</h3>
          <div className="font-sans leading-[normal]">
            {body?.length ? (
              <PortableText value={body} components={policyBodyComponents} />
            ) : null}
          </div>
        </div>
      </TextDistortFilter>
    </section>
  )
}

export default async function PoliciesPage() {
  const { data } = await sanityFetch({
    query: policiesQuery,
    perspective: "published",
  })
  const cms = data as PoliciesData

  // Hero slides. CMS images once they exist; until then the design's hero plus
  // (TEMP) the Services swap images, so the animation runs with real photos.
  let swapImages: { src: string; alt: string; blurDataURL?: string }[]
  const heroAlt = cms?.image?.alt || "Mistress Maggie Peach"
  if (cms?.image?.asset?.url) {
    swapImages = [cms.image, cms.imageSecondary, cms.imageTertiary]
      .filter((img) => img?.asset?.url)
      .map((img) => ({
        src: img!.asset!.url!,
        alt: img!.alt || heroAlt,
        blurDataURL: img!.asset!.metadata?.lqip ?? undefined,
      }))
  } else {
    const { data: svcData } = await sanityFetch({
      query: servicesQuery,
      perspective: "published",
    })
    const services = svcData as {
      imageSecondary?: CmsImage | null
      imageTertiary?: CmsImage | null
    } | null
    swapImages = [
      { src: "/images/policies-hero.png", alt: heroAlt, blurDataURL: undefined },
      ...[services?.imageSecondary, services?.imageTertiary]
        .filter((img) => img?.asset?.url)
        .map((img) => ({
          src: img!.asset!.url!,
          alt: img!.alt || heroAlt,
          blurDataURL: img!.asset!.metadata?.lqip ?? undefined,
        })),
    ]
  }
  const heroSrc = swapImages[0]?.src ?? "/images/policies-hero.png"
  const heroLqip = swapImages[0]?.blurDataURL

  const cmsSections = cms?.sections?.length ? cms.sections : null
  const faqItems: FaqItem[] = cms?.faqs?.length
    ? cms.faqs
        .filter((f) => f.question && f.answer)
        .map((f) => ({ question: f.question!, answer: f.answer! }))
    : FAQS

  return (
    <div className="md:grid md:grid-cols-2 bg-[#FFF7E1]">
      {/* Hero column — the design's ground: the paper cream with the scan
          texture laid over it in exclusion (the Figma layer structure
          verbatim), rose-bordered scroll-swap vignette above it. */}
      <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-[#FFF7E1] md:h-[calc(100dvh_-_var(--announcement-h,0px))] md:p-8">
        <div
          aria-hidden
          className="absolute inset-0 bg-[url('/images/policies-texture.jpg')] bg-cover bg-center mix-blend-exclusion"
        />
        {swapImages.length > 1 ? (
          <ScrollSwapHero
            images={swapImages}
            scrollContainerId="policies-content-scroll"
            uidPrefix="policies-hero"
            mode="wipe"
            variant="rose"
            className="relative z-10 aspect-[480/910] w-full max-w-[340px] lg:max-w-[calc(77dvh_*_480_/_910)]"
          />
        ) : (
          <HeroVignette
            src={heroSrc}
            alt={heroAlt}
            blurDataURL={heroLqip}
            uid="policies-hero"
            variant="rose"
            className="relative z-10 aspect-[480/910] w-full max-w-[340px] lg:max-w-[calc(77dvh_*_480_/_910)]"
          />
        )}
      </div>

      {/* Content column — scrolls internally like Services'. Cream paper ground
          from the design; the boxed stack is capped at the design's 668px. */}
      <div
        id="policies-content-scroll"
        className="scrollbar-hide bg-[#FFF7E1] md:col-start-2 pt-12 pb-16 px-6 md:pt-[100px] md:pb-16 md:px-10 h-[calc(100dvh_-_var(--announcement-h,0px))] overflow-y-scroll xl:px-16"
      >
        <div className="max-w-[668px] mx-auto">
          <HeaderBar label="Policies" />
          {/* Mobile hero — the desktop swap hero lives in the hidden left
              column, so below md the hero joins the boxed stack itself: first
              bordered box under the POLICIES bar, per the mobile design. */}
          <div className="md:hidden border-b-2 border-l-2 border-r-2 border-black border-solid px-[30px] py-[24px] flex justify-center">
            <HeroVignette
              src={heroSrc}
              alt={heroAlt}
              blurDataURL={heroLqip}
              uid="policies-hero-mobile"
              variant="rose"
              strokeWidth={4.75}
              className="aspect-[480/910] w-full"
            />
          </div>
          {cmsSections ? (
            // CMS stack: sections and framed images interleave in whatever
            // order the Studio arranges them. A box directly after an image
            // draws its own top rule.
            cmsSections.map((item, i) =>
              item._type === "image" ? (
                item.asset?.url ? (
                  <ContentVignette
                    key={item._key}
                    src={item.asset.url}
                    alt={item.alt || ""}
                    blurDataURL={item.asset.metadata?.lqip ?? undefined}
                    width={item.asset.metadata?.dimensions?.width ?? 1522}
                    height={item.asset.metadata?.dimensions?.height ?? 842}
                    filterClassName="md:grayscale"
                    borderStroke="#000"
                    bleed
                  />
                ) : null
              ) : (
                <CmsPolicyBox
                  key={item._key}
                  title={item.title}
                  body={item.body}
                  boxTop={cmsSections[i - 1]?._type === "image"}
                />
              )
            )
          ) : (
            <>
              {POLICIES_A.map((section) => (
                <PolicyBox key={section.title} section={section} />
              ))}

              {/* Spread photo — outside the distort filter, like every photo
                  on the site; the landscape vignette matches the design's
                  frame. */}
              <ContentVignette
                src="/images/policies-img.png"
                alt=""
                width={1522}
                height={842}
                filterClassName="md:grayscale"
                borderStroke="#000"
                bleed
              />

              {POLICIES_B.map((section, i) => (
                <PolicyBox key={section.title} section={section} boxTop={i === 0} />
              ))}

              <ContentVignette
                src="/images/policies-img.png"
                alt=""
                width={1522}
                height={842}
                filterClassName="md:grayscale"
                borderStroke="#000"
                bleed
              />
            </>
          )}

          <FaqAccordion items={faqItems} heading="FAQs" />
        </div>
      </div>
    </div>
  )
}
