import Filter from "@/app/components/Filter"
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
    <>    
      <div className=" md:grid md:grid-cols-2 dark:text-white bg-black ">
        <div className="bg-[url('/images/about.jpg')] bg-cover bg-top mix-blend-exclusion"></div>
        {/* Mobile Centerfold Image */}
        <div className="fixed inset-0 z-20 md:hidden pointer-events-none">
          <div className="w-full h-full bg-[url('/images/centerfoldmobile.png')] bg-cover bg-center" />
        </div>
        {/* Medium Centerfold Image */}
        <div className="md:fixed md:inset-0 md:z-20 md:pointer-events-none">
          <div className="md:w-auto md:h-screen md:bg-[url('/images/centerfoldmedium.png')] md:bg-center md:bg-no-repeat md:bg-contain" />
        </div>

  <div className="bg-[url('/images/fence.png')] grayscale bg-cover bg-center md:col-start-2 pt-12 pb-12 px-6 md:pt-16 md:h-screen md:overflow-y-scroll lg:px-26 ">
      <div className="border-1 p-6 bg-black">
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
