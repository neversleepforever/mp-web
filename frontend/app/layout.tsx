import { SanityLive, sanityFetch } from '@/sanity/lib/live'
import { announcementQuery } from '@/sanity/lib/queries'
import AgeCheckServer from './components/AgeCheckServer'
import BaseLayout from './BaseLayout'

// Re-fetch layout-level content (the announcement banner) at most once per
// minute, matching the page routes — without this the layout only updates on
// redeploy.
export const revalidate = 60

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data: announcement } = await sanityFetch({
    query: announcementQuery,
    perspective: 'published',
  })

  return (
    <html lang="en" className="overscroll-none">
      <body className="bg-white overscroll-none">
        <AgeCheckServer>
          <BaseLayout announcement={announcement}>
            {children}
            <SanityLive />
          </BaseLayout>
        </AgeCheckServer>
      </body>
    </html>
  )
}
