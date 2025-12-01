"use client"

import React from "react"
import { usePathname } from "next/navigation"
import FadeInImage from "./FadeInImage"

export default function Centerfold() {
  const pathname = usePathname()
  if (pathname === "/" || pathname === "/folio") return null

  return (
    <>
      {/* Mobile staples */}
      <div className="fixed top-0 left-0 w-full h-[100vh] md:hidden pointer-events-none z-50">
        <FadeInImage
          src="/images/mobilestaples.png"
          alt=""
          fill
          className="object-contain mix-blend-exclusion"
        />
      </div>

      {/* Shadow overlay */}
      <div className="fixed z-50 inset-0 mix-blend-exclusion pointer-events-none">
        <FadeInImage
          src="/images/shadow.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Desktop staples */}
      <div className="md:fixed md:inset-0 md:pointer-events-none z-50">
        <div className="hidden md:h-full md:py-16 md:flex md:items-center md:justify-center">
          <FadeInImage
            src="/images/staples.png"
            alt=""
            width={1000}
            height={2000}     
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </>
  )
}
