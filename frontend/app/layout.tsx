import { SanityLive } from '@/sanity/lib/live'
import BaseLayout from './BaseLayout'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout>
      {children}
      <SanityLive />
    </BaseLayout>
  )
}