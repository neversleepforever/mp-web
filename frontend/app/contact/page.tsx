import { sanityFetch } from "@/sanity/lib/live"
import { defineQuery } from "next-sanity"
import { aboutQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextBlock } from "next-sanity"
import Image from "next/image"
import Link from "next/link"
import Filter from "@/app/components/Filter"
import TextDistortFilter from "@/app/components/TextFilter"
import FadeInImage from "@/app/components/FadeInImage"

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
    <div className="grid grid-cols-2 grid-rows-1 w-screen overflow-hidden" style={{ height: "100svh" }}>
      {/* Mirrored About content (md+ only) */}
      {about?.content?.length ? (
        <div className="pointer-events-none hidden md:block md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-1 -z-10 overflow-hidden">
          <div className="w-full p-6 scale-x-[-1] opacity-15 text-white overflow-hidden" style={{ height: "100svh" }}>

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
            </TextDistortFilter>
    
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

      <div className="hidden overflow-hidden md:block md:absolute inset-y-0 left-0 w-1/2">
        <FadeInImage
          src="/images/fenceblack.png"
          alt=""
          fill
          className="object-cover object-center opacity-70 overflow-hidden"
          priority
        />
      </div>
 
      <section style={{ height: "100svh" }} className="overflow-hidden pointer-events-none w-full col-start-1 row-start-1 col-span-2 row-span-1 flex flex-1 pt-16 md:pt-0 md:items-center justify-center z-40 md:pr-0 dark:text-white ">
     <TextDistortFilter>
        <div className="pointer-events-auto md:bg-black min-w-[calc(100vw-4rem)] md:min-w-auto h-auto md:w-[670px] md:h-[470px] border p-4 md:grid md:grid-cols-2 md:grid-rows-1">
          <div className="flex-1">
            <h1 className="heading-1 mb-8">Contact</h1>

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
        <div className="mt-4 border p-4">
          <h1 className="heading-3">Site Credits</h1>
          <div className="mt-2 font-sans">
            <p>Art Direction & Design: Neversleepforever</p>
            <p className="pt-1">Development: Daniel Fernandes</p>
          </div>
        </div>
    </TextDistortFilter>
      </section>

    </div>
  )
}
