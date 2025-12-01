import FadeInImage from "@/app/components/FadeInImage"
import Rates from "@/app/components/Rates"
import TextDistortFilter from "@/app/components/TextFilter"
import { sanityFetch } from "@/sanity/lib/live"
import { servicesQuery } from "@/sanity/lib/queries"
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity"
import Link from "next/link"


type ImageAsset = {
  _id: string
  url?: string
  metadata?: {
    lqip?: string
    dimensions?: {
      width: number
      height: number
    }
  }
}

interface ServicesImage {
  alt?: string
  credit?: string
  asset?: ImageAsset
}

interface ServicesData {
  _id: string
  content?: PortableTextBlock[]
    image?: ServicesImage
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="heading-1">{children}</h1>,
    h2: ({ children }) => <h2 className="heading-2">{children}</h2>,
    h3: ({ children }) => <h3 className="heading-3">{children}</h3>,
    h4: ({ children }) => <h4 className="heading-4 text-black">{children}</h4>,
    normal: ({ children }) => <p className="mt-6 font-sans">{children}</p>,
  },
  types: {
    image: ({ value }) =>
      value?.asset?.url ? (
        <figure className="my-6">
          <FadeInImage
            src={value.asset.url}
            alt={value.caption || ""}
            width={800}
            height={600}
            blurDataURL={value.asset.metadata?.lqip}
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

    if (!services) return <p>No Services content found. Add it in Sanity Studio.</p>

  const heroImage = services.image;
  const heroAsset = heroImage?.asset;

  return (
    <>

      <div className="md:grid md:grid-cols-2 dark:text-white bg-[#454545]">
        <div className="relative w-full h-full mix-blend-screen">
            {heroAsset?.url ? (
                   <FadeInImage
                     src={heroAsset.url}
                     alt={heroImage?.alt || "Cover Image"}
                     blurDataURL={heroAsset.metadata?.lqip}
                     fill
                     className="object-cover object-top mix-blend-exclusion"
                   />
                 ) : (
                   <div className="w-full h-full" />
                 )}
        </div>

        <div className="relative scrollbar-hide bg-[url('/images/scantexture.jpg')] bg-cover bg-center mix-blend-plus-lighter md:col-start-2 pt-8 pb-12 px-6 md:py-12 md:pl-4 md:pr-6 md:h-screen md:overflow-y-scroll xl:px-26">
          <TextDistortFilter>
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
                      <Link href={`mailto:"missmaggiepeach@gmail.com"`}>
                        <div className="mix-blend-plus-darker flex justify-center bg-white text-[12px] py-[10px] px-16 text-center lg:px-4 lg:[&_br]:hidden">
                          <PortableText
                            value={value.Banner}
                            components={portableTextComponents}
                          /> 
                        </div>
                      </Link>
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
                  image: ({ value }) => {
                    console.log("value", value)
                                    if (!value?.asset?.url) return null
                                  
                                    const url = value.asset.url
                                    const width = value.asset.metadata?.dimensions?.width || 800
                                    const height = value.asset.metadata?.dimensions?.height || 600
                                    return (
                                      <div className="mt-4 mix-blend-difference md:grayscale md:contrast-200">
                                        <FadeInImage
                                          src={url}
                                          alt={value.alt || ""}
                                          width={width}
                                          height={height}
                                          blurDataURL={value.asset.metadata?.lqip}
                                          className="border-white border-1"
                                        />
                                    {value.caption && (
                                      <figcaption className="heading-1 text-justify break-normal pt-4">{value.caption}</figcaption>
                                    )}
                                      </div>
                                    )
                                  },
                },
              }}
            />
          ) : (
            <p>No content added yet.</p>
          )}
          </TextDistortFilter>
        </div>
      </div>
      <FadeInImage src="/images/band.png" alt="Adults Only" width={200} height={200} className="fixed box-content bottom-[0px] right-[0px] z-50 overflow-hidden" />
    </>
  )
}
