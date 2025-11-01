"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Submit() {
  const pathname = usePathname()

  const basePath = pathname?.endsWith("/full")
    ? pathname.replace(/\/full$/, "")
    : pathname

  return (
    <Link
      href={basePath || "/"}
      className="fixed z-40 top-5 left-5 pointer-events-auto uppercase text-[14px] hover:underline"
    >
      Submit
    </Link>
  )
}