// app/BaseLayout.tsx — keep "use client" here
"use client"

import "./globals.css"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import AgeCheck from "./components/AgeCheck"
import Centerfold from "./components/Centerfold"
import { usePathname } from "next/navigation"

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isDark =
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/contact") ||
    pathname?.startsWith("/services")

  return (
    <html lang="en" className="overscroll-none">
      <body className={`${isDark ? "dark" : ""} bg-white dark:bg-black overscroll-none`}>
        <Centerfold />
        <AgeCheck>
          <section className="flex flex-col min-h-[100dvh] overflow-hidden">
            <Header />
            <main className="flex-1 overflow-hidden">{children}</main>
            <Footer />
          </section>
        </AgeCheck>
      </body>
    </html>
  )
}