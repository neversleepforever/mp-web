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
    { href: "/folio", label: "Folio" },
    { href: "https://form.jotform.com/250685995022262", label: "Booking" },
    { href: "/contact", label: "Contact" },
  ]
  
  const hideNav = pathname.endsWith("/full")

  if (hideNav) return null

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-40 py-4 px-7 md:pt-4 dark:text-white bg-transparent">
      <div className="flex w-full">
      
        <nav className="w-full">
            <TextDistortFilter>
          <ul className="flex w-full justify-between text-xs sm:text-base tracking-tight font-nav uppercase">
              <li key={"/"} className="hidden lg:block">
                <TransitionLink
                  href={"/"}
                >
                  
                    <Image
                      src="/images/logo.png"
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
