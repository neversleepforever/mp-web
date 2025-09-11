import {Suspense} from 'react'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'

import {AllPosts} from '@/app/components/Posts'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

export default async function Page() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <>
      <div className="relative">
        <div className="relative">
          <div className="w-full h-full absolute top-0"></div>
        </div>
        <div className=" flex flex-col items-center">
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container">
          {/* <aside className="py-12 sm:py-20">
            <Suspense>{await AllPosts()}</Suspense>
          </aside> */}
        </div>
      </div>
    </>
  )
}
