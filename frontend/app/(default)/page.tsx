import {Suspense} from 'react'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'

import {AllPosts} from '@/app/components/Posts'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Image from 'next/image'

export default async function Page() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <>
      <div className="relative grid grid-rows-4 md:grid-rows-5 xl:grid-rows-1 grid-cols-6 xl:grid-cols-4 h-screen w-screen pt-20 md:pt-8 xl:pt-16 pb-16 overflow-hidden">
        <div className='xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-1 xl:col-start-1 xl:row-start-1'>
          <Image
            src="/images/cover01.png"
            alt="Cover Image 1"
            width={500}
            height={500}
            className="object-contain -rotate-5 -translate-x-7 xl:translate-x-0 xl:translate-y-8 scale-110 xl:scale-115 md:scale-90 drop-shadow-lg/50"
          />
        </div>
        <div className='xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-3 xl:col-start-2 xl:row-start-1'>
          <Image
            src="/images/cover02.png"
            alt="Cover Image 2"
            width={500}
            height={500}
            className="object-contain scale-110 md:scale-90 xl:scale-115 rotate-5 xl:rotate-0 translate-x-12 xl:translate-x-0 xl:-translate-y-8 drop-shadow-lg/50"
          />
        </div>
        <div className='xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-1 row-start-3 xl:col-start-3 xl:row-start-1 z-30'>
          <Image
            src="/images/cover04.png"
            alt="Cover Image 4"
            width={500}
            height={500}
            className="object-contain -rotate-5 xl:rotate-0 -translate-x-7 xl:translate-x-0 -translate-y-7 xl:translate-y-4 scale-110 md:scale-90 xl:scale-115 z-30 drop-shadow-lg/50"
          />
        </div>
        <div className='xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-3 row-start-3 xl:col-start-4 xl:row-start-1 z-20'>
          <Image
            src="/images/cover03.png"
            alt="Cover Image 3"
            width={500}
            height={500}
            className="object-contain scale-110 md:scale-90 xl:scale-115 rotate-15 xl:rotate-8 translate-x-16 xl:translate-x-0 -translate-y-8 xl:translate-y-0 z-20 drop-shadow-lg/50"
          />
        </div>
      </div>
    </>
  )
}
