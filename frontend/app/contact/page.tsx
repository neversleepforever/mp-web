import { sanityFetch } from "@/sanity/lib/live"
import { defineQuery } from "next-sanity"
import { aboutQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextBlock } from "next-sanity"
import Link from "next/link"
import TextDistortFilter from "@/app/components/TextFilter"
import FadeInImage from "@/app/components/FadeInImage"
import { ContentVignette } from "@/app/components/Vignette"

// Re-fetch from Sanity at most once per minute so content edits appear without a redeploy
export const revalidate = 60

interface SocialLink {
  displayTitle: string
  href: string
  openInNewTab?: boolean
}

interface Banner {
  url?: string
  alt?: string
  image?: {
    asset?: {
      url?: string
      metadata?: { dimensions?: { width: number; height: number } }
    }
  }
}

interface ContactData {
  _id: string
  heading?: string
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
    socials1[]{displayTitle, href, openInNewTab},
    socials2[]{displayTitle, href, openInNewTab},
    siteCredits,
    banners[]{
      url,
      alt,
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

  if (!contact) {
    return <p>No contact info found. Add it in Sanity Studio.</p>
  }

  return (
    <div className="dark:bg-black bg-black grid grid-cols-2 grid-rows-1 w-screen overflow-hidden" style={{ height: "100svh" }}>
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

      <div className="absolute inset-0 opacity-30 md:hidden">
        <FadeInImage
          src="/images/linkspage.png"
          alt="Links Page Illustration"
          fill
          className="object-cover object-center opacity-70"
          priority
        />
      </div>

      <div className="hidden overflow-hidden md:block md:absolute inset-y-0 left-0 w-1/2 bg-[url('/images/scantexture.jpg')] bg-cover bg-center opacity-70" />
 
      <section style={{ height: "100svh" }} className="overflow-hidden pointer-events-none w-full col-start-1 row-start-1 col-span-2 row-span-1 flex flex-1 pt-16 px-6 md:px-0 md:pt-0 md:items-center justify-center z-40 md:pr-0 dark:text-white ">
     <TextDistortFilter>
        <div className="pointer-events-auto md:bg-black w-full md:w-[670px] h-auto md:h-[470px] border p-4 md:grid md:grid-cols-2 md:grid-rows-1">
          <div className="flex-1">
            <h1 className="heading-1 mb-8">{contact.heading ?? "Contact"}</h1>

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

          <div className="hidden md:block md:flex md:items-center md:justify-end md:p-6 md:overflow-hidden">
            <FadeInImage
              src="/images/linkspage.png"
              alt="Links Page Illustration"
              width={283}
              height={400}
            />
          </div>
        </div>
        <div className="mt-4 border p-4 md:bg-black pointer-events-auto">
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
        {contact.banners?.length ? (
          // Same box treatment as Site Credits above, so spacing stays consistent.
          <div className="mt-4 border p-4 md:bg-black pointer-events-auto">
            <div className="flex flex-col gap-3 md:gap-4">
              {contact.banners.map((banner, i) => {
                const src = banner.image?.asset?.url
                if (!src) return null
                const dims = banner.image?.asset?.metadata?.dimensions
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
                    className="block w-full h-auto object-contain"
                    draggable={false}
                  />
                )
                return banner.url ? (
                  <a
                    key={i}
                    href={banner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {img}
                  </a>
                ) : (
                  <span key={i} className="block w-full">
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
