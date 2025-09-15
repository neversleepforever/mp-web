import { sanityFetch } from "@/sanity/lib/live"
import { aboutQuery } from "@/sanity/lib/queries"
import { PortableText } from "next-sanity"
import Image from "next/image"

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: aboutQuery })

  if (!data) {
    return <p>No About content found. Add it in Sanity Studio.</p>
  }

  return (
    <div className="container my-12 lg:my-24 dark:text-white">
      {data.content?.length ? (
        <PortableText
          value={data.content}
          components={{
            types: {
              image: ({ value }) => {
                const url = value.asset?.url
                const dims = value.asset?.metadata?.dimensions
                if (!url || !dims) return null
                return (
                  <div className="my-6">
                    <Image
                      src={url}
                      alt={value.alt || ""}
                      width={dims.width}
                      height={dims.height}
                      className="rounded-lg shadow"
                    />
                  </div>
                )
              },
            },
          }}
        />
      ) : (
        <p>No content added yet.</p>
      )}
    </div>
  )
}
