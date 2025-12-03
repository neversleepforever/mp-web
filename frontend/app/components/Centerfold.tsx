"use client"

import React from "react"
import { usePathname } from "next/navigation"
import FadeInImage from "./FadeInImage"

export default function Centerfold() {
  const pathname = usePathname()
  if (pathname === "/") return null

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
        <div className="md:w-auto md:mt-16 md:h-[calc(100vh-8rem)] md:bg-center md:bg-no-repeat md:bg-contain md:mix-blend-difference">
          <FadeInImage
            src="/images/staples.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </>
  )
}