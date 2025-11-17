"use client"

import "./globals.css"

import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import AgeCheck from "./components/AgeCheck"
import Centerfold from "./components/Centerfold"

import { usePathname } from "next/navigation";


export default function BaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const pathname = usePathname();

  const isDark =
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/contact") ||
    pathname?.startsWith("/services");

  return (
    <html
      lang="en"
      className={`overscroll-none`}
    >
      <body className={`${isDark ? "dark" : "" } bg-white dark:bg-black overscroll-none` }>
        <Centerfold />
        <AgeCheck>
          <section className="min-h-screen overscroll-none">
            <Header />
            <main className="overscroll-none">{children}</main>
            <Footer />
          </section>
        </AgeCheck>
      </body>
    </html>
  )
}
