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
        <div className="relative w-full h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <FadeInImage
              src="/images/mobilestaples.png"
              alt=""
              width={800}  // adjust width/height as needed
              height={1600}
              className="max-h-[100dvh] max-w-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Shadow overlay */}
      <div className="fixed z-40 inset-0 mix-blend-exclusion pointer-events-none">
        <FadeInImage
          src="/images/shadow.png"
          alt=""
          fill
          className="object-cover mix-blend-exclusion"
        />
      </div>
      
      {/* Desktop staples */}
{/* <div className="md:fixed md:top-0 md:left-0 md:w-full md:h-[100dvh] md:pointer-events-none z-50">
  <div className="hidden md:block relative md:h-[100dvh]">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <FadeInImage
        src="/images/staples.png"
        alt=""
        width={1000}
        height={2000}
        className="max-h-[100dvh] max-w-full object-contain"
      />
    </div>
  </div>

</div> */}

  <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
    <FadeInImage
      src="/images/staples.png"
      alt=""
      className="max-h-full max-w-full object-contain"
    />
  </div>

    </>
  )
}
