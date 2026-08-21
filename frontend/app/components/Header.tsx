"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import TextDistortFilter from "./TextFilter"
import { TransitionLink } from "./TransitionLink"

// Label on the condensed mobile nav bar.
const MOBILE_NAV_LABEL = "Menu"

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
  // The dropdown link the user tapped. iOS never paints :active here — the
  // tap starts navigation and the closing wipe in the same beat — so the
  // invert is driven from JS: the tapped box goes black and STAYS black
  // while the menu wipes out, reading as the selected state.
  const [pressedHref, setPressedHref] = useState<string | null>(null)
  // The Menu bar's silhouette is an inline SVG (a mask can't draw the thin
  // stroke around the shape), so it needs the bar's real pixel width to draw
  // corner scoops at a fixed radius with no stretch at any device width.
  const barRef = useRef<HTMLButtonElement>(null)
  const [barW, setBarW] = useState(327)
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setBarW(el.offsetWidth))
    ro.observe(el)
    setBarW(el.offsetWidth)
    return () => ro.disconnect()
  }, [])
  // Figma 6171-6404: 25px bar; corners scooped by concave quarter-circles of
  // radius 8 centred on each corner; hairline stroke tracing the silhouette.
  // Path inset by 0.5 so the 1px stroke isn't clipped at the svg edges.
  const R = 8
  const barPath = (w: number) =>
    `M ${R} 0.5 H ${w - R} A ${R} ${R} 0 0 0 ${w - 0.5} ${R} V ${25 - R} A ${R} ${R} 0 0 0 ${w - R} 24.5 H ${R} A ${R} ${R} 0 0 0 0.5 ${25 - R} V ${R} A ${R} ${R} 0 0 0 ${R} 0.5 Z`

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
      // pt-[13.5px] on mobile: pages start their content 56px down, and the
      // 29px tab leaves 27px of free space — split evenly above and below it
      // (py-4 put 16 above and only 11 below). Desktop keeps py-4.
      className={`fixed left-0 right-0 pt-[13.5px] pb-4 px-6 md:px-7 md:pt-4 dark:text-white bg-transparent ${
        menuOpen ? "z-[80]" : "z-[60]"
      } ${isFolioProject ? "hidden" : ""}`}
    >
      <div className="flex w-full">

        {/* Mobile: the six-item row no longer fits, so it condenses into a
            small tab (the vignette's cut-corner silhouette, via a CSS mask)
            that opens the takeover. White with black text on every page. */}
        <button
          ref={barRef}
          type="button"
          onClick={() => {
            if (menuOpen) {
              setCloseDelayed(false)
              setMenuState("closing")
            } else {
              setPressedHref(null)
              setMenuState("open")
            }
          }}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          // mx-px: per the design, the bar is 1px shorter than the dropdown
          // containers on each side.
          className="group md:hidden relative w-full mx-px h-[25px] flex items-center justify-center cursor-pointer text-black hover:text-white active:text-white"
        >
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${barW} 25`}
            preserveAspectRatio="none"
          >
            {/* Rollover/press reverses the bar: black fill, white stroke+label. */}
            <path
              d={barPath(barW)}
              strokeWidth="1"
              className="fill-white stroke-black transition-colors group-hover:fill-black group-hover:stroke-white group-active:fill-black group-active:stroke-white"
            />
          </svg>
          <TextDistortFilter className="relative z-10">
            <span className="font-nav text-[12px] leading-none transition-colors">
              {menuOpen ? "Submit" : barLabel}
            </span>
          </TextDistortFilter>
        </button>

        <nav className="w-full hidden md:block">
            <TextDistortFilter>
          <ul className="flex w-full items-center justify-between text-[12px] tracking-tight font-nav uppercase">
              <li key={"/"} className="hidden lg:block">
                <TransitionLink
                  href={"/"}
                >

                    <Image
                      src="/images/logo/mistress-maggie-peach-1-line-black.svg"
                      alt="Logo"
                      // 160x21 — in proportion with the 12px links.
                      width={160}
                      height={21}
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

    {/* Mobile menu (Figma 6172-6586): no longer a full-page cover. The page
        stays put behind a blur overlay; a dropdown of six boxed links wipes in
        under the bar, whose label reads "Submit" and closes it. */}
    {menuOpen && (
      <>
        {/* Backdrop: blurs and dims everything behind the nav (the header sits
            above at z-[80] while open, so the bar and dropdown stay crisp).
            Tapping it closes, same as Submit. */}
        <div
          aria-hidden
          onClick={() => {
            setCloseDelayed(false)
            setMenuState("closing")
          }}
          className="md:hidden fixed inset-0 z-[70] bg-black/20 backdrop-blur-md"
        />
        <div
          role="dialog"
          aria-modal="true"
          // The gallery scan-wipe, with its hardening (see the locked-viewer
          // flicker playbook): rest in the START state, let the animation with
          // `forwards` fill carry and hold the end state — a late-starting
          // animation then can't flash the finished frame.
          style={
            menuState === "closing"
              ? {
                  // Under the bar: 13.5px header top + 25px bar + 12px gap,
                  // plus the announcement bar when shown.
                  top: "calc(var(--announcement-h, 0px) + 50.5px)",
                  clipPath: "inset(0% 0% 0% 0%)",
                  WebkitClipPath: "inset(0% 0% 0% 0%)",
                  // The rest state (fully shown) holds through any delay, so a
                  // delayed close keeps covering until the wipe begins.
                  animation: `hero-wipe-out 300ms ease-in-out ${closeDelayed ? "300ms" : "0ms"} forwards`,
                }
              : {
                  top: "calc(var(--announcement-h, 0px) + 50.5px)",
                  clipPath: "inset(0% 0% 100% 0%)",
                  WebkitClipPath: "inset(0% 0% 100% 0%)",
                  animation: "hero-wipe-down 300ms ease-in-out forwards",
                }
          }
          onAnimationEnd={() => {
            if (menuState === "closing") setMenuState("closed")
          }}
          className="md:hidden fixed left-6 right-6 z-[80] font-nav text-[12px] text-black"
        >
          <TextDistortFilter>
            {/* Plain Links, NOT TransitionLink: its navigation fades and blurs
                the whole body — including this dropdown — smearing the closing
                wipe. Capture-phase close covers same-page taps too. */}
            <nav
              onClickCapture={() => {
                setCloseDelayed(true)
                setMenuState("closing")
              }}
              className="flex flex-col"
            >
              {takeoverLinks.map(({ href, label }, i) => (
                <Link
                  key={href}
                  href={href}
                  onPointerDown={() => setPressedHref(href)}
                  // -mt-px collapses the meeting borders into a single line
                  // (every box except the first, per the design).
                  // Reverse as on the bar: black box, white text — on hover
                  // for pointers, and held from the tap (pressedHref) through
                  // the closing wipe on touch, since iOS never paints :active
                  // when the tap also starts navigation. The border stays
                  // black so collapsed border lines don't flicker.
                  className={`flex h-[25px] w-full items-center justify-center border border-black transition-colors ${
                    pressedHref === href
                      ? "bg-black text-white"
                      : "bg-white hover:bg-black hover:text-white active:bg-black active:text-white"
                  } ${i > 0 ? "-mt-px" : ""} ${
                    pathname === href ? "line-through" : ""
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </TextDistortFilter>
        </div>
      </>
    )}
</>
  )
}
