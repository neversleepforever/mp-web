"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import TextDistortFilter from "./TextFilter"
import { TransitionLink } from "./TransitionLink"
import { VignetteBorderContentPortrait } from "./VignetteBorder"

// Label on the condensed mobile nav bar.
const MOBILE_NAV_LABEL = "Menu"

// The mobile bar is white with black text everywhere except Policies, whose
// cream page keeps the design's black bar (it doubles as the page's top rule).

export default function Header() {
  const pathname = usePathname()
  // closed → open (wipe down) → closing (wipe up, then unmount).
  const [menuState, setMenuState] = useState<"closed" | "open" | "closing">(
    "closed"
  )
  const menuOpen = menuState !== "closed"
  // Link-tap closes hold the cover a beat (animation-delay) so the destination
  // settles behind the overlay before the wipe unveils it; Submit closes
  // immediately.
  const [closeDelayed, setCloseDelayed] = useState(false)

  const links = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Sessions" },
    { href: "/", label: "Folio" },
    { href: "/bookings", label: "Booking" },
    { href: "/policies", label: "Policies & FAQs" },
    { href: "/contact", label: "Contact" },
  ]

  // The takeover uses the design's title-case labels (the desktop row is
  // uppercased by CSS; the overlay is not).
  const takeoverLinks = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Sessions" },
    { href: "/", label: "Folio" },
    { href: "/bookings", label: "Bookings" },
    { href: "/policies", label: "Policies & FAQs" },
    { href: "/contact", label: "Contact" },
  ]

  const hideNav = pathname.endsWith("/full")
  // Folio project pages (galleries/journals/videos) show the inline viewer —
  // the nav steps out entirely; Submit/Back are the way out.
  const isFolioProject = pathname.startsWith("/folio/")
  const invertedBar = !pathname.startsWith("/policies")

  // Close the takeover whenever navigation lands somewhere new, and hold the
  // page still behind it while it's open.
  useEffect(() => {
    // A route change while the closing wipe is playing must NOT cut it short —
    // the wipe is what unveils the newly-navigated page. Only force-close if
    // the menu is fully open (a navigation that didn't come through it).
    setMenuState((prev) => (prev === "open" ? "closed" : prev))
  }, [pathname])
  // animationend is the normal unmount for the closing wipe; this covers a
  // missed event (frozen tab, interrupted animation) so the overlay can never
  // hang around invisible-but-blocking.
  useEffect(() => {
    if (menuState !== "closing") return
    const t = setTimeout(() => setMenuState("closed"), 1400)
    return () => clearTimeout(t)
  }, [menuState])
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const barLabel = MOBILE_NAV_LABEL

  if (hideNav) return null

  return (
    <>
    <header
      // Sits below the announcement bar when it's shown; the bar publishes its
      // height as --announcement-h and 0px otherwise.
      style={{ top: "var(--announcement-h, 0px)" }}
      // z-[60]: above the centerfold's fold/staple layers (z-50), which
      // otherwise paint their exclusion blend across the nav — most visibly on
      // mobile, where the Menu tab sits dead centre on the fold. Still below
      // the menu takeover (z-[70]).
      className={`fixed left-0 right-0 z-[60] py-4 px-6 md:px-7 md:pt-4 dark:text-white bg-transparent ${
        isFolioProject ? "hidden" : ""
      }`}
    >
      <div className="flex w-full">

        {/* Mobile: the six-item row no longer fits, so it condenses into a
            single full-width bar that opens the takeover. White with black
            text everywhere except Policies (black, per its design). */}
        <button
          type="button"
          onClick={() => setMenuState("open")}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          // The vignette's cut corners, scaled for a 29px bar: the fill is
          // masked to the shape, so it works in either colour.
          style={{
            maskImage: "url(/navbar-mask.svg)",
            WebkitMaskImage: "url(/navbar-mask.svg)",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
          className={`md:hidden w-[80px] mx-auto h-[29px] flex items-center justify-center cursor-pointer ${
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

    {/* Mobile takeover — the full-screen nav. "Submit" holds the top and
        closes it; the links sit dead-centre of the viewport. */}
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
                // The rest state (fully shown) holds through any delay, so a
                // delayed close simply keeps covering until the wipe begins.
                animation: `hero-wipe-out 700ms ease-in-out ${closeDelayed ? "300ms" : "0ms"} forwards`,
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
        className="md:hidden fixed inset-0 z-[70] bg-black flex flex-col items-center py-[35px] text-white font-nav text-[14px]"
      >
        {/* Centred independently of Submit so the links sit in the true
            middle of the screen. The links live inside the content-portrait
            vignette (thin frame, like the b/w content images): plain black
            interior, white links on top. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative aspect-[612/889] w-[280px] max-w-[75vw]">
            <div
              className="absolute inset-0"
              style={{
                maskImage: "url(/vignette-cp-mask.svg)",
                WebkitMaskImage: "url(/vignette-cp-mask.svg)",
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black" />
            </div>
            <VignetteBorderContentPortrait className="pointer-events-none absolute inset-0 h-full w-full select-none" />
            <TextDistortFilter className="absolute inset-0 flex items-center justify-center">
              {/* Plain Links, NOT TransitionLink: its navigation fades and
                  blurs the whole body — including this overlay — smearing the
                  closing wipe. With an instant client-side swap the new page
                  loads behind the black overlay and the wipe-out unveils it.
                  Capture-phase close covers same-page taps too. */}
              <nav
                onClickCapture={() => {
                  setCloseDelayed(true)
                  setMenuState("closing")
                }}
                className="flex flex-col gap-[19px] items-center text-white"
              >
                {takeoverLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={pathname === href ? "line-through" : ""}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </TextDistortFilter>
          </div>
        </div>
        <TextDistortFilter className="relative">
          <button
            type="button"
            onClick={() => {
              setCloseDelayed(false)
              setMenuState("closing")
            }}
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
