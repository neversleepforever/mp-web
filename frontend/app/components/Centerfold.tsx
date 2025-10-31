import React from "react"

export default function Centerfold() {
  return (
   <>
     <div className="fixed inset-0 md:hidden pointer-events-none z-50">
        <div className="w-full h-full bg-[url('/images/centerfoldmobilelight.png')] bg-cover bg-center mix-blend-exclusion" />
    </div>
    <div className="md:fixed md:inset-0 md:pointer-events-none z-50">
        <div className="md:w-auto md:h-screen md:bg-[url('/images/centerfoldmedium.png')] md:bg-center md:bg-no-repeat md:bg-contain md:mix-blend-difference" />
    </div>
   </>
  )
}