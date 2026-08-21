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
        hidden md:fixed md:top-0 md:left-0 md:right-0
        md:h-16 md:flex md:flex-row md:justify-between md:z-50
        md:items-center md:px-8 md:font-nav md:pointer-events-none 
      "
    >
      <TextDistortFilter>
        <TransitionLink
          href={basePath || "/"}
          className="pointer-events-auto text-[12px] cursor-pointer uppercase hover:underline"
        >
          Submit
        </TransitionLink>
      </TextDistortFilter>
    </div>
  )
}
