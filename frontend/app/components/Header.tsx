"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import TextDistortFilter from "./TextFilter"
import { TransitionLink } from "./TransitionLink"

export default function Header() {
  const pathname = usePathname()

  const links = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/", label: "Folio" },
    { href: "/bookings", label: "Booking" },
    { href: "/contact", label: "Contact" },
  ]
  
  const hideNav = pathname.endsWith("/full")
  // Folio project pages (galleries/journals/videos) show the inline viewer
  // below xl — the viewer gets the full-bleed treatment, so the nav steps out
  // the same way it does on /full. At xl the cover-page layout keeps it.
  const isFolioProject = pathname.startsWith("/folio/")

  if (hideNav) return null

  return (
    <>
    <header
      // Sits below the announcement bar when it's shown; the bar publishes its
      // height as --announcement-h and 0px otherwise.
      style={{ top: "var(--announcement-h, 0px)" }}
      className={`fixed left-0 right-0 z-40 py-4 px-7 md:pt-4 dark:text-white bg-transparent ${
        isFolioProject ? "hidden" : ""
      }`}
    >
      <div className="flex w-full">
      
        <nav className="w-full">
            <TextDistortFilter>
          <ul className="flex w-full justify-between text-xs sm:text-base tracking-tight font-nav uppercase">
              <li key={"/"} className="hidden lg:block">
                <TransitionLink
                  href={"/"}
                >
                  
                    <Image
                      src="/images/logo/mistress-maggie-peach-1-line-black.svg"
                      alt="Logo"
                      width={225}
                      height={30}
                      className="object-contain dark:invert"
                    />
                  
                </TransitionLink>
              </li>
           {links.map(({ href, label }) => {
          
              return (
                <li key={href}>
                  <TransitionLink
                    href={href}
                    className={`hover:line-through ${
                      pathname === href ? "line-through" : ""
                    }`}
                  >
                    {label}
                  </TransitionLink>
                </li>
              )
            })}
          </ul>
           </TextDistortFilter>
        </nav>
      </div>
    </header>
</>
  )
}
