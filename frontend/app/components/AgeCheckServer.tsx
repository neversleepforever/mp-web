import "server-only"
import { sanityFetch } from "@/sanity/lib/live"
import { ageCheckQuery } from "@/sanity/lib/queries"
import AgeCheck from "./AgeCheck"

export default async function AgeCheckServer({ children }: { children: React.ReactNode }) {
  const { data } = await sanityFetch({
    query: ageCheckQuery,
    perspective: "published",
  })

  return <AgeCheck content={data}>{children}</AgeCheck> }