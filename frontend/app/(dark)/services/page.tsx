import { sanityFetch } from "@/sanity/lib/live"
import { servicesQuery } from "@/sanity/lib/queries"
import { PortableText } from "next-sanity"
import Image from "next/image"

export default async function ServicesPage() {
  const { data } = await sanityFetch({
    query: servicesQuery,
    perspective: "published",
  })

  if (!data) {
    return <p>No Services content found. Add it in Sanity Studio.</p>
  }

  console.log(data, "data in services");

  return (
    <div className="container my-12 lg:my-24">
      <h1 className="text-4xl font-bold mb-8">Services</h1>
      {data.content?.length ? (
        <PortableText
          value={data.content}
          components={{
            types: {
              servicesSection: ({ value }) => (
                <div className="border p-4 my-6">
                  <h2 className="text-xl font-bold mb-2">{value.title}</h2>
                  <PortableText value={value.body} />
                </div>
              ),
              ratesSection: ({ value }) => (
                <div className="border p-4 my-6 bg-gray-50">
                  <h2 className="text-xl font-bold mb-2">{value.title}</h2>
                  <PortableText value={value.rates} />
                </div>
              ),
              borderedImage: ({ value }) => (
                <figure className="border p-2 my-6">
                  {value.image?.asset?.url && (
                    <Image
                      src={value.image.asset.url}
                      alt={value.caption || ""}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                    />
                  )}
                  {value.caption && (
                    <figcaption className="text-sm text-gray-600 mt-2">
                      {value.caption}
                    </figcaption>
                  )}
                </figure>
              ),
            },
          }}
        />
      ) : (
        <p>No content added yet.</p>
      )}
    </div>
  )
}
