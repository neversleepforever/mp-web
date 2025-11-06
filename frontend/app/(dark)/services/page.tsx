import Filter from "@/app/components/Filter"
import PixelateOverlay from "@/app/components/PixelateOverlay"
import Rates from "@/app/components/Rates"
import TextDistortFilter from "@/app/components/TextFilter"
import { sanityFetch } from "@/sanity/lib/live"
import { servicesQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity"
import Image from "next/image"

interface ServicesData {
  _id: string
  content?: PortableTextBlock[]
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="heading-1">{children}</h1>,
    h2: ({ children }) => <h2 className="heading-2">{children}</h2>,
    h3: ({ children }) => <h3 className="heading-3">{children}</h3>,
    normal: ({ children }) => <p className="mt-6 font-sans">{children}</p>,
  },
  types: {
    image: ({ value }) =>
      value?.asset?.url ? (
        <figure className="my-6">
          <Image
            src={value.asset.url}
            alt={value.caption || ""}
            width={800}
            height={600}
            className="w-full h-auto object-contain"
          />
          {value.caption && (
            <figcaption className="text-sm text-center mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
}

export default async function ServicesPage() {
  const { data } = await sanityFetch({
    query: servicesQuery,
    perspective: "published",
  })

  const services = data as ServicesData | null

  if (!services) {
    return <p>No Services content found. Add it in Sanity Studio.</p>
  }

  return (
    <>
      <TextDistortFilter>
      <div className="md:grid md:grid-cols-2 dark:text-white bg-[#454545]">
        <div className="bg-[url('/images/servicesbg.jpg')] bg-cover bg-center mix-blend-screen"></div>
        <div className="bg-[url('/images/scantexture.jpg')] md:grayscale bg-cover bg-center mix-blend-plus-lighter md:col-start-2 pt-8 pb-12 px-6 md:py-12 md:pl-4 md:pr-6 md:h-screen md:overflow-y-scroll xl:px-26">
          {services.content?.length ? (
            <PortableText
              value={services.content}
              components={{
                ...portableTextComponents,
                types: {
                  ...portableTextComponents.types,
                  servicesSection: ({ value }) => (
                    <div className="border p-4 my-4">
                      <h1 className="heading-1 mb-6">{value.title}</h1>
                      <div className="[&_p]:text-justify text-[20px]">
                        <PortableText
                          value={value.body}
                          components={portableTextComponents}
                        />
                      </div>
                    </div>
                  ),
                  ratesSection: ({ value }) => (
                    <div className="border">
                      <Rates title={value.title} />
                      <h3 className="font-display bg-white text-black text-[12px] py-[10px] px-16 text-center">
                        {value.banner}
                      </h3>
                      <div className="p-4 text-center [&_ul]:mt-6 text-[20px]">
                        <PortableText value={value.rates} components={portableTextComponents} />
                      </div>
                    </div>
                  ),
                  outcallSection: ({ value }) => (
                    <div className="border p-4 my-4">
                      <div className="text-center text-[20px]">
                        <PortableText value={value.body} components={portableTextComponents} />
                      </div>
                    </div>
                  ),
                  virtualSection: ({ value }) => (
                    <div className="border p-4 my-4">
                      <div className="text-center text-[20px]">
                        <PortableText value={value.body} components={portableTextComponents} />
                      </div>
                    </div>
                  ),
                  image: ({ value }) =>
                    value?.asset?.url ? (
                      <figure className="my-4">
                        <Image
                          src={value.asset.url}
                          alt={value.caption || ""}
                          width={800}
                          height={600}
                          className="w-full h-auto object-contain md:grayscale border-white border-1"
                        />
                        {value.caption && (
                          <figcaption className="heading-1 text-justify break-normal pt-4">{value.caption}</figcaption>
                        )}
                      </figure>
                    ) : null,
                },
              }}
            />
          ) : (
            <p>No content added yet.</p>
          )}
        </div>
      </div>

      {/* <div className="fixed bottom-[-30px] left-[-150px] w-[200%] h-[60px] -rotate-45 bg-black text-white flex items-center justify-center shadow-lg overflow-hidden">
        <p className="font-display uppercase pl-[210px]">🍑 Adults Only 🍑</p>
      </div> */}
      </TextDistortFilter>
    </>
  )
}
