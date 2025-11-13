
import {sanityFetch} from '@/sanity/lib/live'
import Image from 'next/image'
import { homeQuery } from "@/sanity/lib/queries"
import Link from 'next/link'

export default async function Page() {
  const {data: home} = await sanityFetch({
    query: homeQuery,
  })

  if (!home) return null

  return (
    <>
      <div className="relative grid grid-rows-4 md:grid-rows-5 xl:grid-rows-1 grid-cols-6 xl:grid-cols-4 h-screen w-screen pt-20 md:pt-8 xl:pt-16 pb-16 overflow-hidden">
        <div className='xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-1 xl:col-start-1 xl:row-start-1'>
          <Link href={home.image1.link || '/'}>
            <Image
              src={home.image1.image.asset.url}
              alt={home.image1.alt || "Cover Image 1"}
              width={500}
              height={500}
              className="object-contain -rotate-5 -translate-x-7 xl:translate-x-0 xl:translate-y-8 scale-110 xl:scale-115 md:scale-90 drop-shadow-lg/50"
            />
          </Link>
        </div>
        <div className='xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-3 xl:col-start-2 xl:row-start-1'>
          <Link href={home.image2.link || '/'}>
            <Image
              src={home.image2.image.asset.url}
              alt={home.image2.alt || "Cover Image 2"}
              width={500}
              height={500}
              className="object-contain scale-110 md:scale-90 xl:scale-115 rotate-5 xl:rotate-0 translate-x-12 xl:translate-x-0 xl:-translate-y-8 drop-shadow-lg/50"
            />
          </Link>
        </div>
        <div className='xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-1 row-start-3 xl:col-start-3 xl:row-start-1 z-30'>
          <Link href={home.image3.link || '/'}>
              <Image
                src={home.image3.image.asset.url}
                alt={home.image3.alt || "Cover Image 3"}
                width={500}
                height={500}
                className="object-contain -rotate-5 xl:rotate-0 -translate-x-7 xl:translate-x-0 -translate-y-7 xl:translate-y-4 scale-110 md:scale-90 xl:scale-115 z-30 drop-shadow-lg/50"
              />
          </Link>
        </div>
        <div className='xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-3 row-start-3 xl:col-start-4 xl:row-start-1 z-10 pointer-events-auto'>
          <Link href={home.image4.link || '/'}>
            <Image
              src={home.image4.image.asset.url}
              alt={home.image4.alt || "Cover Image 4"}
              width={500}
              height={500}
              className="object-contain scale-110 md:scale-90 xl:scale-115 rotate-15 xl:rotate-8 translate-x-16 xl:translate-x-0 -translate-y-8 xl:translate-y-0 z-20 drop-shadow-lg/50"
            />
          </Link>
        </div>
      </div>
    </>
  )
}
