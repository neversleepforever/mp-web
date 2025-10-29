import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { PortableText, type PortableTextComponents } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { journalSlugsQuery, journalQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Link from "next/link"
import Gallery from "../../../../components/Gallery"

export interface Journal {
  _id: string
  title?: string
  subtitle?: string
  photographer?: string
  date?: string
  slug: string
  description?: any[]
  images?: {
    asset?: { url: string }
    alt?: string
    credit?: string
  }[]
}

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
    <div className="fixed inset-0 z-20 md:hidden pointer-events-none">
      <div className="w-full h-full bg-[url('/images/centerfoldmobilelight.png')] bg-cover bg-center" />
    </div>
    <div className="md:fixed md:inset-0 md:z-20 md:pointer-events-none">
      <div className="md:w-auto md:h-screen md:bg-[url('/images/centerfoldmedium.png')] md:bg-center md:bg-no-repeat md:bg-contain" />
    </div>

      <div className="my-12 p-6 lg:p-0 lg:-my-0 lg:pr-7.5 lg:grid lg:grid-cols-2 h-screen">
        <div className="overflow-y-scroll lg:min-h-screen lg:pt-54 lg:py-24 lg:px-30 scrollbar-hide">
          <header className="pb-6">
            <h1 className="heading-1 text-justify">
              {journal.title ?? "Untitled"}
            </h1>
            {journal.subtitle && (
              <p className="text-lg text-gray-600 mt-2">{journal.subtitle}</p>
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
        </div>
        <div className="lg:flex lg:flex-col lg:justify-center lg:pl-24">
          {journal.images?.length ? (
            <Gallery images={journal.images} title={journal.title} />
           ) : null}
        </div>
      </div>
      <nav className="fixed bottom-5 lg:pl-16 uppercase mix-blend-difference z-90">
        <Link href="/folio" className="hover:underline text-[14px]">
          Folio
        </Link>
      </nav>
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