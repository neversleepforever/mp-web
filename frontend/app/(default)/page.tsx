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
      <div className="relative grid grid-rows-4 grid-cols-6 h-screen w-screen pt-20 pb-16 overflow-hidden">
        <div className='col-span-4 row-start-1 col-start-1'>
          <Image
            src="/images/cover01.png"
            alt="Cover Image 1"
            width={500}
            height={500}
            className="object-contain -rotate-5 -translate-x-7 scale-110 drop-shadow-lg/50"
          />
        </div>
        <div className='col-span-4 row-start-1 col-start-3'>
          <Image
            src="/images/cover02.png"
            alt="Cover Image 2"
            width={500}
            height={500}
            className="object-contain scale-110 rotate-5 translate-x-12 drop-shadow-lg/50"
          />
        </div>
        <div className='col-span-4 col-start-1 row-start-3 z-30'>
          <Image
            src="/images/cover04.png"
            alt="Cover Image 4"
            width={500}
            height={500}
            className="object-contain -rotate-5 -translate-x-7 -translate-y-7 scale-110 z-30 drop-shadow-lg/50"
          />
        </div>
        <div className='col-span-4 col-start-3 row-start-3 z-20'>
          <Image
            src="/images/cover03.png"
            alt="Cover Image 3"
            width={500}
            height={500}
            className="object-contain scale-110 rotate-15 translate-x-16 -translate-y-8 z-20 drop-shadow-lg/50"
          />
        </div>
      </div>
    </>
  )
}
