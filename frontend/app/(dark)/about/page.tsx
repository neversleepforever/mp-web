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
    <div className="p-6 m-6 my-12 border-1 lg:my-24 dark:text-white dark:bg-black">
      {data.content?.length ? (
        <PortableText
          value={data.content}
          components={{
            block: {
              h1: ({ children }) => <h1 className="font-sans uppercase heading-1">{children}</h1>,
              normal: ({ children }) => <p className="mt-6">{children}</p>
            },
            types: {
              image: ({ value }) => {
                const url = value.asset?.url
                const dims = value.asset?.metadata?.dimensions
                if (!url || !dims) return null
                return (
                  <div className="mt-6 grayscale">
                    <Image
                      src={url}
                      alt={value.alt || ""}
                      width={dims.width}
                      height={dims.height}
                      className="border-white border-1"
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
