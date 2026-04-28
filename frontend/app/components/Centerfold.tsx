"use client"

import React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Centerfold() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  if (pathname === "/folio") return null;

  const isDark =
    pathname?.startsWith("/about") ||
    // pathname?.startsWith("/contact") ||
    pathname?.startsWith("/services")

  return (
   <>
    <div className="fixed top-0 left-0 w-full h-[100vh] md:hidden pointer-events-none z-50 bg-[url('/images/mobilestaples.png')] bg-no-repeat bg-center mix-blend-exclusion" />

    {/* Base shadow layer — always present */}
    <div className="fixed z-50 inset-0 mix-blend-exclusion pointer-events-none">
      <Image
        src="/images/Shadow2.png"
        alt=""
        fill
        className="object-cover"
      />
    </div>

    {/* Second shadow layer — only on dark pages, stacked for density */}
    {isDark && (
      <div className="fixed z-50 inset-0 mix-blend-exclusion pointer-events-none">
        <Image
          src="/images/Shadow2.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
    )}

    <div className="md:fixed md:inset-0 md:pointer-events-none z-50">
      <div className="md:w-auto md:mt-16 md:h-[calc(100vh-8rem)] md:bg-[url('/images/staples.png')] md:bg-center md:bg-no-repeat md:bg-contain md:mix-blend-difference" />
    </div>
   </>
  )
}