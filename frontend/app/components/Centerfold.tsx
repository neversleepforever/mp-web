import React from "react"
import Image from "next/image"

export default function Centerfold() {
  return (
   <>
     <div className="fixed inset-0 md:hidden pointer-events-none z-50">
        <div className="w-full h-full bg-[url('/images/mobilestaples.png')] bg-no-repeat bg-center mix-blend-exclusion" />
    </div>
      <div className="fixed z-50 inset-0 mix-blend-exclusion pointer-events-none">
        <Image
          src="/images/shadow.png"
          alt=""
          fill
          className="object-cover"
        />
    </div>
    <div className="md:fixed md:inset-0 md:pointer-events-none z-50">
        <div className="md:w-auto md:mt-16 md:h-[calc(100vh-8rem)] md:bg-[url('/images/staples.png')] md:bg-center md:bg-no-repeat md:bg-contain md:mix-blend-difference" />
    </div>

   </>
  )
}