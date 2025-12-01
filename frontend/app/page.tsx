import { sanityFetch } from '@/sanity/lib/live'
import { homeQuery } from "@/sanity/lib/queries"
import TextDistortFilter from './components/TextFilter'
import DraggableImages from './components/DraggableImages'

export default async function Page() {
  const { data: home } = await sanityFetch({ query: homeQuery })
  if (!home) return null

  return (
    <TextDistortFilter className='overscroll-none'>
     <div className="overscroll-none relative grid grid-rows-4 md:grid-rows-5 lg:grid-rows-5 xl:grid-rows-1 grid-cols-6 xl:grid-cols-4 h-[100dvh] max-h-[100dvh] w-screen pt-16 md:pt-8 lg:pt-36 pb-16 overflow-hidden">
        <DraggableImages home={home} />
      </div>
    </TextDistortFilter>
  )
}
