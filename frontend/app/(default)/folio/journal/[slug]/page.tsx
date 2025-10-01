import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { PortableText, type PortableTextComponents } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { journalSlugsQuery, journalQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Link from "next/link"
import Gallery from "../../../../components/Gallery"

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

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: journalSlugsQuery,
    perspective: "published",
    stega: false,
  })
  return data as { slug: string }[]
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: journalQuery,
    params,
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
      journal?.subtitle ||
      journal?.description?.[0]?.children?.[0]?.text ||
      undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  }
}

export default async function JournalPage({ params }: Props) {
  const { data } = await sanityFetch({
    query: journalQuery,
    params,
  })

  const journal = data as Journal | null
  if (!journal?._id) return notFound()

  return (
    <>    
    <div className="fixed inset-0 z-20 md:hidden pointer-events-none">
      <div className="w-full h-full bg-[url('/images/centerfoldmobilelight.png')] bg-cover bg-center" />
    </div>

      <div className="my-12 lg:my-24 p-6">
        <header className="pb-6">
          <h1 className="text-[38px] font-bold tracking-tight text-gray-900">
            {journal.title ?? "Untitled"}
          </h1>
          {journal.subtitle && (
            <p className="text-lg text-gray-600 mt-2">{journal.subtitle}</p>
          )}
          <div className="mt-8 text-[18px]">
            {journal.photographer && (
              <div className="uppercase">Shot By {journal.photographer}</div>
            )}
            {journal.date && <div>{journal.date}</div>}
          </div>
        </header>

        <div className="text-[22px]">
          {journal.description?.length ? (
            <PortableText value={journal.description} components={{
              ...portableTextComponents,
            }} />
          ) : null}
        </div>

        {journal.images?.length ? (
          <Gallery images={journal.images} title={journal.title} />
        ) : null}

        <nav className="fixed bottom-7 uppercase mix-blend-difference z-90">
          <Link href="/folio" className="hover:underline text-[14px]">
            Folio
          </Link>
        </nav>
      </div>
    </>

  )
}
