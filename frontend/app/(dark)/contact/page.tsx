import { sanityFetch } from "@/sanity/lib/live"
import { defineQuery } from "next-sanity"
import { aboutQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextBlock } from "next-sanity"
import Image from "next/image"
import Link from "next/link"
import Filter from "@/app/components/Filter"

interface SocialLink {
  displayTitle: string
  href: string
  openInNewTab?: boolean
}

interface ContactData {
  _id: string
  socials1?: SocialLink[]
  socials2?: SocialLink[]
}

interface AboutData {
  _id: string
  content?: PortableTextBlock[]
}

const contactQuery = defineQuery(`
  *[_type == "contact"][0]{
    _id,
    socials1[]{displayTitle, href, openInNewTab},
    socials2[]{displayTitle, href, openInNewTab}
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
    <div className="relative min-h-screen pt-16">
      {/* Mobile background image */}
      <div className="fixed inset-0 -z-20 md:hidden">
        <div className="w-full h-full bg-[url('/images/linkspage.png')] bg-cover bg-center bg-black/30 bg-blend-multiply" />
      </div>

      {/* Medium Centerfold Image */}
      <div className="md:fixed md:inset-0 md:z-20 md:pointer-events-none">
        <div className="md:w-auto md:h-screen md:bg-[url('/images/centerfoldmedium.png')] md:bg-center md:bg-no-repeat md:bg-contain" />
      </div>

      {/* Mirrored About content (md+ only) */}
      {about?.content?.length ? (
        <div className="pointer-events-none hidden md:block absolute inset-y-0 left-0 w-1/2 -z-10 overflow-hidden">
          <div className="h-full w-full p-6 scale-x-[-1] opacity-15 text-white">
            <Filter>
              <PortableText
                value={about.content}
                components={{
                  block: {
                    h1: ({ children }) => (
                      <h1 className="font-sans uppercase text-[38px] mb-6">{children}</h1>
                    ),
                    normal: ({ children }) => <p className="mt-6">{children}</p>,
                  },
                  types: {
                    image: ({ value }) => {
                      const url = value.asset?.url
                      const dims = value.asset?.metadata?.dimensions
                      if (!url || !dims) return null
                      return (
                        <div className="mt-6 grayscale mix-blend-difference">
                          <Image
                            src={url}
                            alt={value.alt || ""}
                            width={dims.width}
                            height={dims.height}
                            className="border-white border"
                          />
                        </div>
                      )
                    },
                  },
                }}
              />
            </Filter>
          </div>
        </div>
      ) : null}

      {/* Contact content */}
      <section className="z-40 md:flex md:items-center md:justify-center px-6 dark:text-white min-h-[calc(100vh-72px)]">
        <div className="w-full max-w-[668px] max-h-[470px] border p-6 bg-black md:py-12 md:px-10 md:m-4 md:flex md:items-start">
          <div className="flex-1">
            <h1 className="text-[38px] mb-8">Contact</h1>

            {contact.socials1?.length ? (
              <div className="mb-8">
                <ul>
                  {contact.socials1.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        target={link.openInNewTab ? "_blank" : "_self"}
                        rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                        className="text-[37px] leading-none transition-colors"
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
                        className="text-[37px] leading-none transition-colors"
                      >
                        {link.displayTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="hidden md:block flex-shrink-0 md:flex-1 md:flex md:justify-end">
            <Image
              src="/images/linkspage.png"
              alt="Links Page Illustration"
              width={245}
              height={370}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
