import { sanityFetch } from "@/sanity/lib/live"
import { defineQuery } from "next-sanity"
import { aboutQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextBlock } from "next-sanity"
import Link from "next/link"
import TextDistortFilter from "@/app/components/TextFilter"
import { ContentVignette } from "@/app/components/Vignette"

// Re-fetch from Sanity at most once per minute so content edits appear without a redeploy
export const revalidate = 60

interface SocialLink {
  displayTitle: string
  href: string
  openInNewTab?: boolean
}

interface BannerAsset {
  url?: string
  metadata?: { dimensions?: { width: number; height: number } }
}

interface Banner {
  /** Current field name. `url` is the earlier one, kept so existing rows work. */
  linkUrl?: string
  url?: string
  alt?: string
  /** Current shape: the array item is the image itself. */
  asset?: BannerAsset
  /** Earlier shape: the image was nested in the array item. Kept so banners
   *  added before the schema changed still render. */
  image?: { asset?: BannerAsset }
}

interface ContactImage {
  alt?: string
  asset?: {
    url?: string
    metadata?: {
      lqip?: string
      dimensions?: { width: number; height: number }
    }
  }
}

interface ContactData {
  _id: string
  heading?: string
  image?: ContactImage
  socials1?: SocialLink[]
  socials2?: SocialLink[]
  siteCredits?: PortableTextBlock[]
  banners?: Banner[]
}

interface AboutData {
  _id: string
  content?: PortableTextBlock[]
}

const contactQuery = defineQuery(`
  *[_type == "contact"][0]{
    _id,
    heading,
    image{
      alt,
      asset->{
        _id,
        url,
        metadata{
          lqip,
          dimensions { width, height }
        }
      }
    },
    socials1[]{displayTitle, href, openInNewTab},
    socials2[]{displayTitle, href, openInNewTab},
    siteCredits,
    banners[]{
      linkUrl,
      url,
      alt,
      asset->{
        url,
        metadata{ dimensions{ width, height } }
      },
      image{
        asset->{
          url,
          metadata{ dimensions{ width, height } }
        }
      }
    }
  }
`)

export default async function ContactPage() {
  const [{ data: contactData }, { data: aboutData }] = await Promise.all([
    sanityFetch({ query: contactQuery }),
    sanityFetch({ query: aboutQuery }),
  ])

  const contact = contactData as ContactData | null
  const about = aboutData as AboutData | null

  // Editable in the Studio; falls back to the bundled illustration so the page
  // still looks right before an image is set.
  const illustration = contact?.image?.asset
  const illustrationSrc = illustration?.url ?? "/images/linkspage.png"
  const illustrationAlt = contact?.image?.alt ?? "Links Page Illustration"
  const illustrationDims = illustration?.metadata?.dimensions ?? {
    width: 1875,
    height: 2834,
  }

  // Accept either stored shape, and keep only banners that will actually
  // render — an entry with no asset would otherwise leave an empty box.
  const banners = (contact?.banners ?? [])
    .map((b) => ({ ...b, resolved: b.asset ?? b.image?.asset }))
    .filter((b) => b.resolved?.url)

  if (!contact) {
    return <p>No contact info found. Add it in Sanity Studio.</p>
  }

  // One locked screen from md up. On phones the page grows with its content and
  // scrolls instead — with three boxes it no longer fits a short screen, and
  // overflow-hidden made anything past the fold unreachable.
  return (
    <div className="dark:bg-black bg-black grid grid-cols-2 grid-rows-1 w-screen min-h-[calc(100svh_-_var(--announcement-h,0px))] md:h-[calc(100svh_-_var(--announcement-h,0px))] md:overflow-hidden">
      {/* Mirrored About content (md+ only) */}
      {about?.content?.length ? (
        <div className="pointer-events-none hidden md:block md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-1 z-0 overflow-hidden">
          <div className="w-full p-6 md:px-16 md:pt-16 scale-x-[-1] opacity-15 text-white overflow-hidden" style={{ height: "100svh" }}>
            <div className="border-1 p-6 bg-black">
            <TextDistortFilter>
              <PortableText
                value={about.content}
                components={{
                  block: {
                    h1: ({ children }) => (
                      <h1 className="heading-1 mb-6">{children}</h1>
                    ),
                    normal: ({ children }) => <p className="mt-6">{children}</p>,
                  },
                  types: {
                    image: ({ value }) => {
                      const url = value.asset?.url
                      const dims = value.asset?.metadata?.dimensions
                      if (!url || !dims) return null
                      return (
                        <div className="mt-6 mix-blend-difference">
                          <ContentVignette
                            src={url}
                            alt={value.alt || ""}
                            blurDataURL={value.asset?.metadata?.lqip}
                            width={dims.width}
                            height={dims.height}
                          />
                        </div>
                      )
                    },
                  },
                }}
              />
            </TextDistortFilter>
  </div>
          </div>
        </div>
      ) : null}

      {/* Contact content */}

      <div className="hidden overflow-hidden md:block md:absolute inset-y-0 left-0 w-1/2 bg-[url('/images/scantexture.jpg')] bg-cover bg-center opacity-70" />
 
      <section className="min-h-[calc(100svh_-_var(--announcement-h,0px))] md:h-[calc(100svh_-_var(--announcement-h,0px))] md:overflow-hidden pointer-events-none w-full col-start-1 row-start-1 col-span-2 row-span-1 flex flex-1 pt-16 pb-16 px-6 md:pb-0 md:px-0 md:pt-0 md:items-center justify-center z-40 md:pr-0 dark:text-white ">
     <TextDistortFilter>
        <div className="pointer-events-auto md:bg-black w-full md:w-[670px] h-auto md:h-[470px] border p-4 md:grid md:grid-cols-2 md:grid-rows-1">
          <div className="flex-1">
            <h1 className="heading-1 mb-8">{contact.heading ?? "Contact"}</h1>

            {/* Mobile only: the illustration sits inside the box under the
                heading, in the same ContentVignette the About page uses for its
                content photos. It used to be a full-bleed background behind the
                whole page, which read nothing like the rest of the site.
                Desktop keeps its own copy in the right-hand column. */}
            <ContentVignette
              src={illustrationSrc}
              alt={illustrationAlt}
              blurDataURL={illustration?.metadata?.lqip}
              width={illustrationDims.width}
              height={illustrationDims.height}
              className="md:hidden mb-8"
            />

            {contact.socials1?.length ? (
              <div className="mb-8">
                <ul>
                  {contact.socials1.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        target={link.openInNewTab ? "_blank" : "_self"}
                        rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                        className="text-[37px] leading-[1.1] transition-colors hover:line-through"
                      >
                        {link.displayTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {contact.socials2?.length ? (
              <div>
                <ul>
                  {contact.socials2.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        target={link.openInNewTab ? "_blank" : "_self"}
                        rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                        className="text-[37px] leading-[1.1] transition-colors hover:line-through"
                      >
                        {link.displayTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* pl only — padding on all sides pushed the image 41px off the right
              edge while the text sat at 17px. The box's own p-4 sets the gap. */}
          <div className="hidden md:block md:flex md:items-center md:justify-end md:pl-6 md:overflow-hidden">
            {/* Same ContentVignette as the mobile copy above, so the framing
                matches across breakpoints. */}
            <ContentVignette
              src={illustrationSrc}
              alt={illustrationAlt}
              blurDataURL={illustration?.metadata?.lqip}
              width={illustrationDims.width}
              height={illustrationDims.height}
            />
          </div>
        </div>
        {/* Same width as the box above, so the three stack flush. Without it
            these stretch to the parent and sit ~19px wider. */}
        <div className="mt-4 border p-4 md:bg-black pointer-events-auto w-full md:w-[670px]">
          <h1 className="heading-3">Site Credits</h1>
          <div className="mt-2 font-sans">
            {contact.siteCredits?.length ? (
              <PortableText
                value={contact.siteCredits}
                components={{
                  block: {
                    normal: ({ children }) => <p className="font-sans">{children}</p>,
                  },
                  marks: {
                    link: ({ children, value }) => (
                      <a
                        href={value?.href}
                        target={value?.openInNewTab ? "_blank" : "_self"}
                        rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
                        className="hover:line-through"
                      >
                        {children}
                      </a>
                    ),
                  },
                }}
              />
            ) : null}
          </div>
        </div>
        {banners.length ? (
          // Same box treatment as Site Credits above, so spacing stays consistent.
          <div className="mt-4 border p-4 md:bg-black pointer-events-auto w-full md:w-[670px]">
            <h1 className="heading-3">Directory</h1>
            {/* A touch more room than Site Credits' mt-2 — the banners are
                images rather than text and need the extra breathing space. */}
            <div className="mt-[14px] flex flex-col gap-3 md:gap-4">
              {banners.map((banner, i) => {
                const src = banner.resolved!.url!
                const dims = banner.resolved?.metadata?.dimensions
                const img = (
                  // Plain <img> with the untouched asset URL on purpose: running a
                  // GIF through next/image optimisation flattens it to one frame.
                  <img
                    src={src}
                    alt={banner.alt || ""}
                    width={dims?.width}
                    height={dims?.height}
                    // Full width of the box, so a wide banner reaches the right
                    // edge like the boxes above it. Height follows the aspect
                    // ratio, which also shrinks them naturally on mobile.
                    // Greyscale until hovered, so the colour is the reward for
                    // pointing at one.
                    className="block w-full h-auto object-contain grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                    draggable={false}
                  />
                )
                const href = banner.linkUrl ?? banner.url
                return href ? (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block w-full"
                  >
                    {img}
                  </a>
                ) : (
                  <span key={i} className="group block w-full">
                    {img}
                  </span>
                )
              })}
            </div>
          </div>
        ) : null}
    </TextDistortFilter>
      </section>
    </div>
  )
}
