import Filter from "@/app/components/Filter"
import TextDistortFilter from "@/app/components/TextFilter"
import { sanityFetch } from "@/sanity/lib/live"
import { aboutQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextBlock } from "next-sanity"
import Image from "next/image"

interface AboutData {
  _id: string
  content?: PortableTextBlock[]
}

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: aboutQuery })
  const about = data as AboutData | null   // ← cast result

  if (!about) return <p>No About content found. Add it in Sanity Studio.</p>

  return (
    <>    
      <div className=" md:grid md:grid-cols-2 dark:text-white bg-black ">
        <div className="bg-[url('/images/about.jpg')] bg-cover bg-top mix-blend-exclusion"></div>

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
                  const url = value.asset?.url
                  const dims = value.asset?.metadata?.dimensions
                  if (!url || !dims) return null
                  return (
                    <div className="mt-6 mix-blend-difference md:grayscale md:contrast-200">
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
        </TextDistortFilter>
      </div>
      </div>
    {/* <div className="fixed inset-0 z-10 md:hidden pointer-events-none">
      <div className="w-full h-full bg-[url('/images/centerfoldmobile.png')] bg-cover bg-center" />
    </div>
    <div className="fixed inset-0 -z-10 md:hidden pointer-events-none">
      <div className="w-full h-full bg-[url('/images/fence.png')] bg-cover bg-center" />
    </div> */}
    {/* <Filter> */}
    {/* </Filter> */}
    </>
  )
}
