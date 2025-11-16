import FadeInImage from "@/app/components/FadeInImage"
import Image from "next/image"
import TextDistortFilter from "@/app/components/TextFilter"
import { sanityFetch } from "@/sanity/lib/live"
import { aboutQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextBlock } from "next-sanity"

interface AboutData {
  _id: string
  content?: PortableTextBlock[]
}

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: aboutQuery })
  const about = data as AboutData | null 

  if (!about) return <p>No About content found. Add it in Sanity Studio.</p>

  return (
    <>    
      <div className=" md:grid md:grid-cols-2 dark:text-white bg-black ">
        <div className="relative">
          <FadeInImage
            src="/images/about.jpg"
            alt="About background"
            fill
            className="object-cover object-top mix-blend-exclusion"
          />
        </div>
  <div className="bg-[url('/images/fence.png')] bg-cover bg-center md:col-start-2 pt-12 pb-16 px-6 md:pt-16 md:h-screen md:overflow-y-scroll lg:px-26 ">
  <TextDistortFilter>
      <div className="border-1 p-6 bg-black">
      {about.content?.length ? (
          <PortableText
            value={about.content}
            components={{
              block: {
                h1: ({ children }) => <h1 className="heading-1">{children}</h1>,
                h2: ({ children }) => <h2 className="heading-2">{children}</h2>,
                h3: ({ children }) => <h3 className="heading-3">{children}</h3>,
                normal: ({ children }) => <p className="font-sans text-[22px] mt-6">{children}</p>
              },
              types: {
                image: ({ value }) => {
                  if (!value?.asset?.url) return null
                  const url = value.asset.url
                  const width = value.asset.metadata?.dimensions?.width || 800
                  const height = value.asset.metadata?.dimensions?.height || 600
                  return (
                    <div className="mt-6 mix-blend-difference md:grayscale md:contrast-200">
                      <FadeInImage
                        src={url}
                        alt={value.alt || ""}
                        width={width}
                        height={height}
                        blurDataURL={value.asset.metadata?.lqip}
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
        </TextDistortFilter>
      </div>
      </div>
    </>
  )
}
