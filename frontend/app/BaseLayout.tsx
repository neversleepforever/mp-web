// app/BaseLayout.tsx
import "./globals.css"

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from "next/font/google"
import { draftMode } from "next/headers"
import { VisualEditing, toPlainText } from "next-sanity"

import DraftModeToast from "@/app/components/DraftModeToast"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import { sanityFetch, SanityLive } from "@/sanity/lib/live"
import { settingsQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import { handleError } from "./client-utils"
import AgeCheck from "./components/AgeCheck"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export default async function BaseLayout({
  children,
  theme = "default",
}: {
  children: React.ReactNode
  theme?: "default" | "dark"
}) {
  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <html
      lang="en"
      className={`${inter.variable}`}
    >
      <body className={`${theme === "dark" ? "dark" : "" } dark:bg-black` }>
        <AgeCheck>
          <section className="min-h-screen">
            <SanityLive onError={handleError} />
            <Header />
            <main>{children}</main>
            {/* <Footer /> */}
          </section>
        </AgeCheck>

        <svg height="0" width="0" className="absolute">
          <defs>
            <filter id="blurfilter" x="0" y="0">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>
        </svg>

        <SpeedInsights />
      </body>
    </html>
  )
}
