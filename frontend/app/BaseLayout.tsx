"use client"

import "./globals.css"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import Centerfold from "./components/Centerfold"
import AnnouncementBanner, { type AnnouncementData } from "./components/AnnouncementBanner"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function BaseLayout({
  children,
  announcement,
}: {
  children: React.ReactNode
  announcement?: AnnouncementData | null
}) {
  const pathname = usePathname()

  const isDark =
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/contact") ||
    pathname?.startsWith("/bookings") ||
    pathname?.startsWith("/services")

  useEffect(() => {
    document.body.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <section
      // The banner and Header are both fixed, so the page content shifts down
      // by the banner's height too — keeping the nav-to-content spacing the
      // same as without the banner. --announcement-h is 0px when it's off.
      style={{ paddingTop: "var(--announcement-h, 0px)" }}
      className="flex flex-col min-h-[100dvh] overflow-hidden"
    >
      <Centerfold />
      <AnnouncementBanner data={announcement ?? null} />
      <Header />
      <main className="flex-1 overflow-hidden">{children}</main>
      <Footer />
    </section>
  )
}