"use client"

import "./globals.css"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import Centerfold from "./components/Centerfold"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isDark =
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/contact") ||
    pathname?.startsWith("/services")

  useEffect(() => {
    document.body.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <section className="flex flex-col min-h-[100dvh] overflow-hidden">
      <Centerfold />
      <Header />
      <main className="flex-1 overflow-hidden">{children}</main>
      <Footer />
    </section>
  )
}