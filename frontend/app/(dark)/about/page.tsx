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
    <div className="md:grid md:grid-cols-2">
    <div className="md:bg-gray-800"></div>
    <div className="p-6 m-6 md:pl-4 md:pr-6 md:ml-4 md:mr-6 md:mt-18 border-1 dark:text-white dark:bg-black">
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
                  <div className="mt-6 grayscale mix-blend-difference">
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
    </div>
  )
}
