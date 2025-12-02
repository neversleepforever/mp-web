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
      <div className="fixed top-0 left-0 w-full h-[100dvh] md:hidden pointer-events-none z-50 overscroll-contain">
        <FadeInImage
          src="/images/mobilestaples.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Shadow overlay */}
      <div className="fixed z-40 inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] -translate-x-1/2 -translate-y-1/2">
          <FadeInImage
            src="/images/shadow.png"
            alt=""
            fill
            className="object-contain mix-blend-exclusion"
          />
        </div>
      </div>


      {/* Desktop staples */}
<div className="md:fixed md:top-0 md:left-0 md:w-full md:h-[100dvh] md:pointer-events-none z-50">
  <div className="hidden md:flex md:h-[100dvh] md:items-center md:justify-center">
    <FadeInImage
      src="/images/staples.png"
      alt=""
      width={1000}
      height={2000}
      className="max-h-[100dvh] max-w-full object-contain"
    />
  </div>
</div>
    </>
  )
}
