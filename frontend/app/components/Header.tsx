"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import TextDistortFilter from "./TextFilter"
import { TransitionLink } from "./TransitionLink"

// Label on the condensed mobile nav bar; the current page's name is appended
// ("Menu: Services") when there is one.
const MOBILE_NAV_LABEL = "Menu"

// Pages whose mobile bar inverts (white bar, black text): the dark-themed
// pages. Light paper pages (folio grid, policies) keep the black bar.
const INVERTED_BAR_PAGES = ["/about", "/services", "/bookings", "/contact"]

export default function Header() {
  const pathname = usePathname()
  // closed → open (wipe down) → closing (wipe up, then unmount).
  const [menuState, setMenuState] = useState<"closed" | "open" | "closing">(
    "closed"
  )
  const menuOpen = menuState !== "closed"

  const links = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/", label: "Folio" },
    { href: "/bookings", label: "Booking" },
    { href: "/policies", label: "Policies & FAQs" },
    { href: "/contact", label: "Contact" },
  ]

  // The takeover uses the design's title-case labels (the desktop row is
  // uppercased by CSS; the overlay is not).
  const takeoverLinks = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/", label: "Folio" },
    { href: "/bookings", label: "Bookings" },
    { href: "/policies", label: "Policies & FAQs" },
    { href: "/contact", label: "Contact" },
  ]

  const hideNav = pathname.endsWith("/full")
  // Folio project pages (galleries/journals/videos) show the inline viewer —
  // the nav steps out entirely; Submit/Back are the way out.
  const isFolioProject = pathname.startsWith("/folio/")
  const invertedBar = INVERTED_BAR_PAGES.some((p) => pathname.startsWith(p))

  // Close the takeover whenever navigation lands somewhere new, and hold the
  // page still behind it while it's open.
  useEffect(() => {
    setMenuState("closed")
  }, [pathname])
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  // The page suffix ("Menu: Services") only appears after in-site navigation —
  // a fresh landing reads plain "Menu".
  const initialPathRef = useRef(pathname)
  const [hasNavigated, setHasNavigated] = useState(false)
  useEffect(() => {
    if (pathname !== initialPathRef.current) setHasNavigated(true)
  }, [pathname])

  const currentLabel = takeoverLinks.find((l) => l.href === pathname)?.label
  const barLabel =
    hasNavigated && currentLabel
      ? `${MOBILE_NAV_LABEL}: ${currentLabel}`
      : MOBILE_NAV_LABEL

  if (hideNav) return null

  return (
    <>
    <header
      // Sits below the announcement bar when it's shown; the bar publishes its
      // height as --announcement-h and 0px otherwise.
      style={{ top: "var(--announcement-h, 0px)" }}
      className={`fixed left-0 right-0 z-40 py-4 px-6 md:px-7 md:pt-4 dark:text-white bg-transparent ${
        isFolioProject ? "hidden" : ""
      }`}
    >
      <div className="flex w-full">

        {/* Mobile: the six-item row no longer fits, so it condenses into a
            single full-width bar that opens the takeover. Black-on-light
            pages / inverted on the dark pages, per the design. */}
        <button
          type="button"
          onClick={() => setMenuState("open")}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          className={`md:hidden w-full h-[29px] flex items-center justify-center cursor-pointer ${
            invertedBar ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <TextDistortFilter>
            <span className="font-nav text-[14px] leading-none">
              {barLabel}
            </span>
          </TextDistortFilter>
        </button>

        <nav className="w-full hidden md:block">
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

    {/* Mobile takeover — the full-screen nav. Links stack from the top,
        "Submit" holds the bottom and closes it. */}
    {menuOpen && (
      <div
        role="dialog"
        aria-modal="true"
        // The gallery scan-wipe, and its hardening (see the locked-viewer
        // flicker playbook): rest in the START state, let the animation with
        // `forwards` fill carry and hold the end state — a late-starting
        // animation then can't flash the finished frame.
        style={
          menuState === "closing"
            ? {
                clipPath: "inset(0% 0% 0% 0%)",
                WebkitClipPath: "inset(0% 0% 0% 0%)",
                animation: "hero-wipe-out 700ms ease-in-out forwards",
              }
            : {
                clipPath: "inset(0% 0% 100% 0%)",
                WebkitClipPath: "inset(0% 0% 100% 0%)",
                animation: "hero-wipe-down 700ms ease-in-out forwards",
              }
        }
        onAnimationEnd={() => {
          if (menuState === "closing") setMenuState("closed")
        }}
        className="md:hidden fixed inset-0 z-[70] bg-black flex flex-col items-center py-[35px] text-white font-nav text-[20px]"
      >
        <TextDistortFilter className="flex-1 flex flex-col items-center min-h-0 w-full">
          {/* Capture-phase close: TransitionLink owns its own onClick, and a
              tap on the current page's link never changes the pathname — this
              closes the takeover on any link tap regardless. */}
          <nav
            onClickCapture={() => setMenuState("closing")}
            className="flex-1 flex flex-col gap-[19px] items-center"
          >
            {takeoverLinks.map(({ href, label }) => (
              <TransitionLink
                key={href}
                href={href}
                className={pathname === href ? "line-through" : ""}
              >
                {label}
              </TransitionLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setMenuState("closing")}
            className="cursor-pointer"
          >
            Submit
          </button>
        </TextDistortFilter>
      </div>
    )}
</>
  )
}
