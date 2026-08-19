import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { PortableText, type PortableTextComponents } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { journalSlugsQuery, journalQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Gallery, { GalleryImage } from "../../../components/Gallery"
import TextDistortFilter from "@/app/components/TextFilter"
import Link from "next/link"

export interface Journal {
  _id: string
  title?: string
  subtitle?: string
  photographer?: string
  date?: string
  slug: string
  description?: any[]
  images?: GalleryImage[]
}

export const revalidate = 60 

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: journalSlugsQuery,
    perspective: "published",
    stega: false,
  })
  return (data || []).map((item: any) => ({ slug: item.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const { data } = await sanityFetch({
    query: journalQuery,
    params: { slug },
    stega: false,
  })

  const journal = data as Journal | null
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = journal?.images?.[0]
    ? resolveOpenGraphImage(journal.images[0])
    : null

  return {
    title: journal?.title ?? "Untitled",
    description:
      journal?.subtitle || journal?.description?.[0]?.children?.[0]?.text,
    openGraph: { images: ogImage ? [ogImage, ...previousImages] : previousImages },
  }
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data } = await sanityFetch({
    query: journalQuery,
    params: { slug },
  })

  const journal = data as Journal | null
  if (!journal?._id) return notFound()

  return (
    <>
      {/* Same standing "Submit" as the gallery/video pages: the way back to
          the folio grid at desktop, where the nav and footer Back are hidden
          on folio project pages. */}
      <div
        style={{ top: "var(--announcement-h, 0px)" }}
        className="hidden xg:block fixed left-0 py-4 px-7 z-50"
      >
        <TextDistortFilter>
          <Link
            href="/"
            className="uppercase hover:line-through text-[14px] text-black mix-blend-difference font-nav"
          >
            Submit
          </Link>
        </TextDistortFilter>
      </div>
      <div className="my-12 md:my-16 p-6 md:p-0 pt-0 xl:p-0 xl:-my-0 xl:grid xl:grid-cols-2 xl:h-screen overscroll-none">
        <div className="overflow-y-scroll md:px-20 lg:pb-16 xl:min-h-screen xl:pt-54 xl:py-24 lg:px-30 lg:overscroll-none scrollbar-hide">
          <TextDistortFilter>
          <header className="mb-6">
            <h1 className="heading-1 text-justify">
              {journal.title ?? "Untitled"}
            </h1>
            {journal.subtitle && (
              <p className="heading-3 mt-2">{journal.subtitle}</p>
            )}
              <div className="mt-8 text-[18px] font-extrabold mb-3">
              {journal.date && (
                  <p className="uppercase font-sans text-[18px]">
                    {new Date(journal.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              {journal.photographer && (
                <div className="uppercase font-nav text-[12px]">{journal.photographer}</div>
              )}
            </div>
          </header>
          <div className="text-[22px]">
            {journal.description?.length ? (
              <PortableText value={journal.description} components={{
                ...portableTextComponents,
              }} />
            ) : null}
          </div>
          </TextDistortFilter>
        </div>

        
          {journal.images?.length ? (
            <div className="w-screen overscroll-none overflow-hidden lg:ml-0 lg:mr-0 lg:w-full lg:px-30 xl:pl-30 xl:pt-20 xl:pb-20 xl:pr-7.5 lg:flex lg:flex-col lg:justify-center xl:max-h-screen">
              <Gallery images={journal.images} title={journal.title} />
            </div>
           ) : null}

      </div>

    </>

  )
}


const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="heading-1">{children}</h1>,
    h2: ({ children }) => <h2 className="heading-2">{children}</h2>,
    h3: ({ children }) => <h3 className="heading-3">{children}</h3>,
    normal: ({ children }) => <p className="mt-6 font-sans">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mt-4 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mt-4 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-6">{children}</li>,
    number: ({ children }) => <li className="ml-6">{children}</li>,
  },
}