"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  const links = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/folio", label: "Folio" },
    { href: "https://form.jotform.com/250685995022262", label: "Booking" },
    { href: "/contact", label: "Contact" },
  ]
  
  const hideNav = pathname.startsWith("/folio/")

  if (hideNav) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-40 py-4 px-7 md:pt-4 dark:text-white bg-transparent">
      <div className="flex w-full">
        <nav className="w-full">
          <ul className="flex w-full justify-between text-xs sm:text-base tracking-tight font-mono">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`hover:line-through ${
                    pathname === href ? "line-through" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
