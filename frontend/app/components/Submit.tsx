"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import TextDistortFilter from "./TextFilter"
import { TransitionLink } from "./TransitionLink"

export default function Submit() {
  const pathname = usePathname()
  const router = useRouter()

  const basePath = pathname?.endsWith("/full")
    ? pathname.replace(/\/full$/, "")
    : pathname

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        if (basePath) router.push(basePath)
        else router.push("/")
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [basePath, router])

  return (
    <div
      className="
        hidden xl:fixed xl:top-0 xl:left-0 xl:right-0
        xl:h-16 xl:flex xl:flex-row xl:justify-between xl:z-50
        xl:items-center xl:px-8 xl:font-nav xl:pointer-events-none 
      "
    >
      <TextDistortFilter>
        <TransitionLink
          href={basePath || "/"}
          className="pointer-events-auto text-[14px] cursor-pointer uppercase hover:underline"
        >
          Submit
        </TransitionLink>
      </TextDistortFilter>
    </div>
  )
}
