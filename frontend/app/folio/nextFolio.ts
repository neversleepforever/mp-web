import { sanityFetch } from "@/sanity/lib/live"
import { folioOrderQuery } from "@/sanity/lib/queries"

/** Href of the folio entry after (type, slug) in the grid's order, wrapping
 *  from the last back to the first — the "Don't Stop" target. Null when there
 *  is nowhere else to go (a single entry, or an empty folio). */
export async function getNextFolioHref(
  type: "gallery" | "journal" | "video",
  slug: string
): Promise<string | null> {
  const { data } = await sanityFetch({ query: folioOrderQuery, stega: false })
  const list = (data ?? []) as { _type: string; slug: string }[]
  if (list.length < 2) return null
  const i = list.findIndex((f) => f._type === type && f.slug === slug)
  // An unpublished/preview entry isn't in the published list — fall back to
  // the top of the grid rather than rendering no CTA.
  const next = list[(i + 1) % list.length]
  if (next._type === type && next.slug === slug) return null
  return `/folio/${next._type}/${next.slug}`
}
