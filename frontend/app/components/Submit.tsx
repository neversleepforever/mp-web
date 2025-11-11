"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Submit() {
  const pathname = usePathname()

  const basePath = pathname?.endsWith("/full")
    ? pathname.replace(/\/full$/, "")
    : pathname

  return (


      <div className="
        hidden xl:fixed xl:top-0 xl:left-0 xl:right-0
        xl:h-16 xl:flex xl:flex-row xl:justify-between xl:z-50
        xl:items-center xl:px-8 xl:font-nav xl:pointer-events-none 
      ">    
      <Link
        href={basePath || "/"}
        className="pointer-events-auto text-[14px] cursor-pointer uppercase hover:underline"
      >   
          Submit
      </Link>
      </div>
  )
}