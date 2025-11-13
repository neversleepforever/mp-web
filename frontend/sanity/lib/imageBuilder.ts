import { createClient } from "next-sanity"
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
// import imageUrlBuilder from "@sanity/image-url"

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2023-10-01",
  useCdn: true,
})

// export const urlFor = (source: any) =>
//   imageUrlBuilder(sanityClient).image(source)


// Create an image URL builder using the client
const builder = imageUrlBuilder(sanityClient)
// Export a function that can be used to get image URLs
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}