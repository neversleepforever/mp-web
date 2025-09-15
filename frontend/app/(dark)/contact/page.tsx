import { sanityFetch } from "@/sanity/lib/live"
import { defineQuery } from "next-sanity"
import Link from "next/link"

const contactQuery = defineQuery(`
  *[_type == "contact"][0]{
    _id,
    socials1[]{
      displayTitle,
      href,
      openInNewTab
    },
    socials2[]{
      displayTitle,
      href,
      openInNewTab
    }
  }
`)

export default async function ContactPage() {
  const { data } = await sanityFetch({ query: contactQuery })

  if (!data) {
    return <p>No contact info found. Add it in Sanity Studio.</p>
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold mb-8">Contact</h1>
      {data.socials1?.length > 0 && (
        <div className="mb-8">
          <ul className="space-y-2">
            {data.socials1.map((link: any, i: number) => (
              <li key={i}>
                <Link
                  href={link.href}
                  target={link.openInNewTab ? "_blank" : "_self"}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  className="text-blue-600 hover:underline"
                >
                  {link.displayTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.socials2?.length > 0 && (
        <div>
          <ul className="space-y-2">
            {data.socials2.map((link: any, i: number) => (
              <li key={i}>
                <Link
                  href={link.href}
                  target={link.openInNewTab ? "_blank" : "_self"}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  className="text-blue-600 hover:underline"
                >
                  {link.displayTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
