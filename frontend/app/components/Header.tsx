"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  const links = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/folio", label: "Folio" },
    { href: "/booking", label: "Booking" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="fixed z-40 inset-0 h-4 py-4 px-7 md:pt-8 dark:text-white">
      <div className="flex w-full">
        <nav className="w-full">
          <ul className="flex w-full justify-between text-xs sm:text-base tracking-tight font-mono">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`hover:underline ${
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
