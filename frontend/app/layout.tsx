import { SanityLive } from '@/sanity/lib/live'
import AgeCheckServer from './components/AgeCheckServer'
import BaseLayout from './BaseLayout'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overscroll-none">
      <body className="bg-white overscroll-none">
        <AgeCheckServer>
          <BaseLayout>
            {children}
            <SanityLive />
          </BaseLayout>
        </AgeCheckServer>
      </body>
    </html>
  )
}