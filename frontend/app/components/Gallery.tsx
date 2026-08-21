"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import MuxPlayer from "@mux/mux-player-react"
import type MuxPlayerElement from "@mux/mux-player"
import { urlFor } from "@/sanity/lib/imageBuilder"
import TextDistortFilter from "./TextFilter"
import { TransitionLink } from "./TransitionLink"

export interface GalleryImage {
  asset: {
    _id: string
    metadata?: {
      lqip?: string
      dimensions?: {
        width: number
        height: number
      }
    }
  }
  alt?: string
  credit?: string
}

type Props = {
  images: GalleryImage[]
  title?: string
  enableKeyboard?: boolean
  showControls?: boolean
  /** Optional Mux video shown as the first slide, ahead of the images. Omitted
   *  everywhere except the video pages, so galleries and journals are unaffected. */
  leadVideo?: { playbackId: string }
  /** Desktop scroll-lock (≥1280): once the viewer fills the screen the wheel
   *  flips slides instead of scrolling the page; wheel-up on the first slide
   *  releases back into the text above. A "Submit" link (top-left) shows only
   *  while locked. Passed only by the inline gallery/video pages — journals and
   *  /full pages never lock. */
  deskLock?: boolean
  /** Next folio entry for the "Don't Stop" CTA (bottom-right, opposite Info,
   *  fading in and out with the lock). Omitted → no CTA. */
  nextHref?: string
}

export default function Gallery({
  images,
  title,
  enableKeyboard = true,
  showControls = false,
  leadVideo,
  deskLock = false,
  nextHref,
}: Props) {
  const [loaded, setLoaded] = useState<boolean[]>(() =>
    new Array(images.length).fill(false)
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedByTap, setSelectedByTap] = useState(false)
  const [scrollLocked, setScrollLocked] = useState(false)
  // When the rail last scrolled. iOS fires click on a thumb if a touch ends
  // there after only a small drag — which is exactly what scrubbing a short
  // strip looks like — and the tap handler's smooth scrollBy then kills the
  // native gesture dead: the rail "locks" mid-scrub. A click during (or just
  // after) rail movement is a scrub, not a tap; ignore it.
  const railScrollAtRef = useRef(0)

  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
  const mainImageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<MuxPlayerElement | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // Whether the desktop viewer is "locked" (sticky and filling the frame) —
  // drives the Submit/Info links. Updated from the scroll listener.
  const [deskLocked, setDeskLocked] = useState(false)
  const selectedIndexRef = useRef(selectedIndex)
  selectedIndexRef.current = selectedIndex

  // The scroll-driven mode runs at the xg breakpoint (1133px — landscape
  // tablets and desktop; portrait iPads top out at 1032). Tracked as state so
  // the wrappers and listeners switch cleanly if the window crosses it.
  const [isXg, setIsXg] = useState(false)
  const zoneRef = useRef<HTMLDivElement>(null)
  // The pin wrapper. Pinning must ALSO be applied imperatively at engage and
  // release: React state lands a frame later, and a paint in that gap shows
  // the zone's empty middle (a white flash) — see engageLock.
  const pinRef = useRef<HTMLDivElement>(null)

  // The cycle zone makes the document ~10k px tall, which shrinks the window
  // scrollbar to a sliver that jumps on every wrap teleport. It means nothing
  // in an endless cycle, so the locked-viewer pages hide it.
  useEffect(() => {
    if (!deskLock) return
    document.documentElement.classList.add("viewer-scrollbar-hide")
    return () =>
      document.documentElement.classList.remove("viewer-scrollbar-hide")
  }, [deskLock])
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1133px)")
    const update = () => setIsXg(mq.matches)
    update()
    // Both signals: the matchMedia change event can fail to fire on some
    // resize paths, and a stale isXg would leave the lock latched (body class
    // and all) on a viewport where Submit/Info can't render. The resize
    // listener guarantees the crossing is always seen; scrollDrive flipping
    // false runs the scroll effect's cleanup, which unwinds the whole lock.
    mq.addEventListener("change", update)
    window.addEventListener("resize", update)
    return () => {
      mq.removeEventListener("change", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  // With a lead video the slides are [video, ...images], so slide index and
  // image index differ by one. Everything below counts slides; `leadOffset`
  // converts back to an image index.
  const hasLead = Boolean(leadVideo?.playbackId)
  const leadOffset = hasLead ? 1 : 0
  const slideCount = images.length + leadOffset

  /** Shortest circular distance from the selected slide, so next is always +1
   *  (below) and prev -1 (above) and last↔first wraps seamlessly. */
  const offsetFor = (slideIndex: number) => {
    let offset = (((slideIndex - selectedIndex) % slideCount) + slideCount) % slideCount
    if (offset > slideCount / 2) offset -= slideCount
    return offset
  }

  // Scan-wipe transitions, matching the hero swaps: forward wipes down,
  // backward rewinds up. The original slide+fade is kept intact below —
  // flip to false to restore it.
  const WIPE = true

  // Master switch for the desktop locked-viewer experiment. The lock is
  // SCROLL-DRIVEN (same mechanism as the ScrollSwapHero pages): the viewer is
  // position:sticky behind a tall scroll zone and the slide index derives from
  // scroll position. No wheel listeners, no preventDefault — an earlier
  // wheel-capture version progressively wedged Safari until the page stopped
  // scrolling entirely. deskLock also styles the stacked desktop stage
  // (centring, hidden arrows).
  const DESK_SCROLL_LOCK = true
  // On-screen readout of every scroll decision (zoneTop / idx / locked) — the
  // on-device diagnostic that cracked the Safari freeze. Flip on when the
  // locked viewer misbehaves somewhere the console can't reach.
  const DESK_LOCK_DEBUG = false
  const debugRef = useRef<HTMLPreElement>(null)
  const debugLine = useRef({ n: 0 })
  const dbg = (s: string) => {
    if (debugRef.current)
      debugRef.current.textContent = `#${++debugLine.current.n} ${s}`
  }

  // Scroll distance that advances one slide. The locked viewer cycles
  // endlessly: the slide index is modulo, the zone is three full cycles long,
  // and the scroll handler teleports the position by ±one cycle whenever it
  // nears a band edge — invisible, because the viewer is pinned and the index
  // is unchanged mod N. The browser's real scroll ends are never reached.
  const SLIDE_PX = 300
  const scrollDrive = deskLock && DESK_SCROLL_LOCK && isXg
  const scrollDriveRef = useRef(false)
  scrollDriveRef.current = scrollDrive
  const cyclePx = slideCount * SLIDE_PX
  const zoneScrollHeight = cyclePx * 3

  /** Jump the page to the scroll position that renders `slide` — keeps clicks
   *  and keyboard consistent with the scroll listener that owns the index.
   *  While latched, lands in the middle wrap band (index unchanged mod N). */
  const scrollToSlide = (slide: number) => {
    const zone = zoneRef.current
    if (!zone) return
    const top = zone.getBoundingClientRect().top + window.scrollY
    const bandOffset = lockLatchRef.current ? cyclePx : 0
    window.scrollTo({ top: top + bandOffset + slide * SLIDE_PX })
  }

  // In scroll-drive mode navigation moves the page — the scroll listener owns
  // the index. Once latched, one slide is one SLIDE_PX of scroll, and the
  // teleport band makes stepping wrap endlessly. Everywhere else it steps the
  // index directly, wrapping as before.
  const goPrev = () => {
    if (scrollDriveRef.current) {
      if (lockLatchRef.current) window.scrollBy(0, -SLIDE_PX)
      else scrollToSlide(Math.max(0, selectedIndexRef.current - 1))
    } else setSelectedIndex((i) => (i - 1 + slideCount) % slideCount)
  }

  const goNext = () => {
    if (scrollDriveRef.current) {
      if (lockLatchRef.current) window.scrollBy(0, SLIDE_PX)
      else scrollToSlide(Math.min(slideCount - 1, selectedIndexRef.current + 1))
    } else setSelectedIndex((i) => (i + 1) % slideCount)
  }

  // Wipe bookkeeping: which slide is being covered/uncovered, which way the
  // edge travels (shortest circular direction, so wrap-around still reads as
  // forward), and a counter so nothing animates before the first interaction.
  // Adjusted during render (React's sanctioned prev-state pattern) rather than
  // in an effect — an effect runs after paint, which let the first click paint
  // an unanimated jump frame before the wipe kicked in.
  const [wipe, setWipe] = useState({ cur: 0, prev: 0, back: false, count: 0 })
  if (wipe.cur !== selectedIndex) {
    const n = slideCount
    let off = (((selectedIndex - wipe.cur) % n) + n) % n
    if (off > n / 2) off -= n
    setWipe({ cur: selectedIndex, prev: wipe.cur, back: off < 0, count: wipe.count + 1 })
  }
  const { prev: wipePrev, back: wipeBack, count: wipeCount } = wipe

  /** Per-slide style in wipe mode — same layering as ScrollSwapHero: forward,
   *  the incoming slide wipes down on top; backward, the outgoing slide rolls
   *  back up off the slide beneath. */
  const wipeStyle = (slideIndex: number, visible: boolean): React.CSSProperties => {
    const isActive = slideIndex === selectedIndex
    const isPrev = slideIndex === wipePrev && !isActive
    // The opacity transition keeps the still-loading case soft: if a photo
    // finishes decoding after its wipe already played, it fades in instead of
    // popping — the same courtesy the slide+fade version extended.
    const base = { opacity: visible ? 1 : 0, transition: "opacity 400ms ease" }
    const SHOWN = "inset(0% 0% 0% 0%)"
    const HIDDEN = "inset(0% 0% 100% 0%)"
    // Animating slides REST in their start state and let the animation (with
    // `forwards` fill) carry and hold them at the end state. Resting at the
    // end state flashed it for a frame whenever the browser began the
    // animation late — the incoming image popped fully visible before its
    // wipe. Inverted, a late start just leaves the outgoing image up one
    // extra frame, which is imperceptible.
    // Off-stage slides are visibility:hidden ON TOP of being clipped: Safari
    // can flash a freshly-decoded image unclipped for one frame as it first
    // paints into a clip-masked layer (the "next image" micro-flicker at
    // lock-in). An unpainted layer has nothing to flash. visibility isn't in
    // the transition list, so it flips instantly on activation.
    if (wipeBack && wipeCount > 0) {
      if (isPrev)
        return { ...base, visibility: "visible" as const, clipPath: SHOWN, WebkitClipPath: SHOWN, animation: "hero-wipe-out 700ms ease-in-out forwards", zIndex: 2 }
      return { ...base, visibility: isActive ? ("visible" as const) : ("hidden" as const), clipPath: isActive ? SHOWN : HIDDEN, WebkitClipPath: isActive ? SHOWN : HIDDEN, zIndex: isActive ? 1 : 0 }
    }
    // `visible` gates the wipe: on a fresh arrival the incoming photo can
    // still be downloading, and wiping in an invisible slide reads as a
    // blink. Withheld until loaded, the animation starts the moment the flag
    // flips, so the reveal is always an actual wipe.
    const wiping = isActive && wipeCount > 0 && visible
    return {
      ...base,
      visibility: isActive || isPrev ? ("visible" as const) : ("hidden" as const),
      clipPath: wiping ? HIDDEN : isActive || isPrev ? SHOWN : HIDDEN,
      WebkitClipPath: wiping ? HIDDEN : isActive || isPrev ? SHOWN : HIDDEN,
      animation: wiping ? "hero-wipe-down 700ms ease-in-out forwards" : undefined,
      zIndex: isActive ? 2 : isPrev ? 1 : 0,
    }
  }

  // Two frames, so a cached image has a painted opacity-0 frame to fade from —
  // without it the browser jumps straight to opaque and the photo pops in.
  const handleLoad = (index: number) => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setLoaded((prev) => {
          if (prev[index]) return prev
          const updated = [...prev]
          updated[index] = true
          return updated
        })
      )
    )
  }

  // A cached image can finish before React attaches onLoad, so that event never
  // fires. Catch it from the ref instead, or the slide stays invisible forever.
  const catchAlreadyLoaded = (el: HTMLImageElement | null, index: number) => {
    if (el?.complete && el.naturalWidth > 0) handleLoad(index)
  }

  const hideArrows = pathname.includes("/journal")
  const isFullGallery = pathname?.endsWith("/full")
  const basePath = pathname?.endsWith("/full")
    ? pathname.replace(/\/full$/, "")
    : pathname

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === "arrowup" || key === "arrowleft") {
        e.preventDefault()
        goPrev()
      } else if (key === "arrowdown" || key === "arrowright") {
        e.preventDefault()
        goNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enableKeyboard, images.length])

  // Desktop wheel navigation (hover-to-flip). Superseded by the deskLock
  // handler below when that mode is on — running both would double-step.
  useEffect(() => {
    if (deskLock && DESK_SCROLL_LOCK) return
    const mediaQuery = window.matchMedia("(min-width: 1280px)")
    if (!mediaQuery.matches) return

    const container = mainImageRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout | null = null
    let scrollAccumulated = 0
    let isLocked = false
    const SCROLL_THRESHOLD = 40
    // Fixed cooldown: after a step we ignore wheel events for COOLDOWN_MS, then
    // re-arm. The timer runs independently of incoming events, so this keeps the
    // pace snappy (one image per ~280ms while scrolling) rather than waiting for a
    // flick's full momentum tail to die. Trade-off: a hard pull whose inertia
    // outlasts the cooldown can advance more than one image.
    const COOLDOWN_MS = 290

    const handleWheel = (e: WheelEvent) => {
      if (!container.contains(e.target as Node)) return

      if (isLocked) return

      scrollAccumulated += e.deltaY

      if (Math.abs(scrollAccumulated) > SCROLL_THRESHOLD) {
        if (scrollAccumulated > 0) goNext()
        else goPrev()

        scrollAccumulated = 0
        isLocked = true
        if (scrollTimeout) clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          isLocked = false
          scrollAccumulated = 0
        }, COOLDOWN_MS)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => {
      window.removeEventListener("wheel", handleWheel)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
    // Note: selectedIndex is intentionally NOT a dependency — goNext/goPrev use
    // functional updates, so the listener never needs to be re-subscribed. If it
    // were, every navigation would reset the debounce lock and a single trackpad
    // flick would whip through several images.
  }, [images.length, deskLock])

  // Desktop locked viewer, scroll-driven (the ScrollSwapHero mechanism): the
  // pinned viewer rides a tall zone and the slide index is a pure function of
  // how far into the zone the page has scrolled. Scrolling stays 100% native —
  // a passive listener can't fight Safari (the wheel-capture version this
  // replaces progressively wedged it until scrolling died).
  //
  // The lock is one-way. On engage the body gets `gallery-locked`, which
  // display:nones the page's text column (.gallery-lock-hide) — the zone
  // becomes the whole document, so there is nothing above the viewer to scroll
  // back to; the browser stops at a native wall. Scroll position is
  // compensated across both collapse and restore so the viewer never jumps.
  // Only Info releases (releaseLock below); Submit leaves the page entirely.
  const lockLatchRef = useRef(false)
  // When the lock engaged — the entry settle holds slide 0 briefly after.
  const engageAtRef = useRef(0)
  const ENGAGE_HOLD_MS = 350
  // True while Info's glide back to the top is in flight — the scroll events it
  // fires cross the engage threshold and would instantly re-latch the lock.
  // Cleared on arrival (scrollY ~0) or by timeout if Safari cancels the glide.
  const releasingRef = useRef(false)

  const releaseLock = () => {
    const zone = zoneRef.current
    if (zone && document.body.classList.contains("gallery-locked")) {
      // Shed whole cycles first (index is unchanged mod N), so the glide home
      // rewinds through at most one cycle's worth of slides.
      const s = -zone.getBoundingClientRect().top
      const excess = Math.floor(s / cyclePx) * cyclePx
      if (excess > 0) window.scrollTo(0, window.scrollY - excess)
      const before = zone.getBoundingClientRect().top
      document.body.classList.remove("gallery-locked")
      const after = zone.getBoundingClientRect().top
      window.scrollTo(0, window.scrollY + (after - before))
    }
    lockLatchRef.current = false
    releasingRef.current = true
    setTimeout(() => {
      releasingRef.current = false
    }, 2500)
    // Deliberately NOT unpinning here: mid-zone, the viewer's flow position is
    // far above the viewport, so dropping position:fixed now makes it vanish
    // in a single frame — the "jump". It stays pinned through the glide; the
    // scroll listener unpins at the exact frame the zone top re-enters view,
    // where the pinned and in-flow positions coincide, and from there the
    // viewer scrolls away naturally as the text arrives.
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    if (!scrollDrive) return
    const zone = zoneRef.current
    if (!zone) return

    const engageLock = () => {
      lockLatchRef.current = true
      engageAtRef.current = performance.now()
      // Pin FIRST, synchronously: the text collapse and the cycle-park below
      // move the wrapper's flow position ~3000px above the viewport, and the
      // React-rendered fixed style only lands on the next render. A paint in
      // that gap showed the zone's empty middle — a white flash on every
      // lock-in. With the inline style set here, no such frame can exist
      // (React then renders the identical style, so nothing changes).
      const pin = pinRef.current
      if (pin) {
        pin.style.position = "fixed"
        pin.style.top = "0px"
        pin.style.left = "0px"
        pin.style.right = "0px"
        pin.style.height = "100vh"
        pin.style.zIndex = "10"
      }
      document.body.classList.add("gallery-locked")
      // Park EXACTLY one cycle in (slide 0, wrap room in both directions),
      // discarding the flick's overshoot past the engage point. Preserving the
      // overshoot let a slide transition land on this same frame — and amid
      // the pin + text collapse + scroll teleport the browser skips the wipe's
      // first frames, so the next image flashed in unmasked before the mask
      // caught up. Decoupled, the first transition happens a scroll-beat
      // later on a calm frame.
      const zoneDocTop = zone.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, zoneDocTop + cyclePx)
      setDeskLocked(true)
    }

    const onScroll = () => {
      const r = zone.getBoundingClientRect()
      if (r.height === 0) return
      // Info's glide home: hold the current slide (no rewind-flash through the
      // wipes), keep the viewer pinned until the zone top re-enters view (the
      // seamless handoff point), and stand down once the top is reached.
      if (releasingRef.current) {
        if (r.top >= 0) {
          // Unpin imperatively for the same reason engage pins imperatively:
          // waiting for the React render leaves a frame where the zone top has
          // passed the viewport top but the viewer is still fixed — a nudge.
          const pin = pinRef.current
          if (pin) {
            pin.style.position = ""
            pin.style.top = ""
            pin.style.left = ""
            pin.style.right = ""
            pin.style.zIndex = ""
            pin.style.height = "100vh"
          }
          setDeskLocked(false)
        }
        if (window.scrollY <= 1) releasingRef.current = false
        return
      }
      // `priming` guards the mount-time call below: arriving from another
      // project page (Don't Stop) the effect runs BEFORE Next resets the
      // scroll position, so this read the OLD page's deep offset and locked
      // instantly — text column gone before it was ever seen. Real scroll
      // events (including Next's reset itself) engage as before.
      if (!lockLatchRef.current && r.top <= 0 && !priming) engageLock()
      // Endless cycling: teleport a whole cycle before either band edge can be
      // reached. Invisible — pinned viewer, same index mod N.
      if (lockLatchRef.current) {
        const s = -zone.getBoundingClientRect().top
        if (s < cyclePx * 0.5) window.scrollTo(0, window.scrollY + cyclePx)
        else if (s > cyclePx * 2.5) window.scrollTo(0, window.scrollY - cyclePx)
      }
      const rNow = zone.getBoundingClientRect()
      const stepped = Math.round(-rNow.top / SLIDE_PX)
      // Modulo only once latched (endless cycling); before the lock the zone
      // hasn't been entered and the index pins to the first slide.
      let idx = lockLatchRef.current
        ? ((stepped % slideCount) + slideCount) % slideCount
        : Math.min(slideCount - 1, Math.max(0, stepped))
      // Entry settle: a fast flick reaches the first slide-step one or two
      // frames after engage, while the browser is still digesting the pin +
      // text collapse + scroll teleport — activating a slide's layer in that
      // churn is where Safari flashes it unclipped. Hold the first slide for
      // a beat; scroll takes over on a calm frame.
      if (
        lockLatchRef.current &&
        performance.now() - engageAtRef.current < ENGAGE_HOLD_MS
      )
        idx = 0
      setSelectedIndex(idx)
      dbg(
        `SCROLL zoneTop=${Math.round(rNow.top)} idx=${idx} locked=${lockLatchRef.current} sY=${Math.round(window.scrollY)}`
      )
    }

    let priming = true
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    priming = false
    return () => {
      window.removeEventListener("scroll", onScroll)
      // Never leave the lock behind us (route changes, rotating/resizing below
      // the xg breakpoint, unmount while locked): restore the text, drop the
      // latch, and clear the locked state so Submit/Info gating can't go
      // stale. Below xg the lock must never exist in any form.
      document.body.classList.remove("gallery-locked")
      lockLatchRef.current = false
      releasingRef.current = false
      setDeskLocked(false)
    }
  }, [scrollDrive, slideCount, pathname])

  // Keep the active thumbnail centred in the vertical rail as the locked
  // viewer advances — past a screenful of thumbs the current one drifted out
  // of view and there was no way to trace where you were. Scrolls only the
  // rail, never via scrollIntoView: that would also scroll the window, and in
  // this mode the window's scroll position IS the slide index.
  useEffect(() => {
    if (!scrollDrive) return
    const container = containerRef.current
    const thumb = thumbnailRefs.current[selectedIndex]
    if (!container || !thumb) return
    const delta =
      thumb.getBoundingClientRect().top - container.getBoundingClientRect().top
    container.scrollTo({
      top:
        container.scrollTop +
        delta -
        container.clientHeight / 2 +
        thumb.clientHeight / 2,
      behavior: "smooth",
    })
  }, [selectedIndex, scrollDrive])

  // Mobile/tablet thumbnail scroll selection. On deskLock pages the
  // scroll-driven viewer owns the index from the xg breakpoint (1133), so this
  // must stand down there; elsewhere (/full, journals) it stands down at xl.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const mediaQuery = window.matchMedia(
      deskLock ? "(min-width: 1133px)" : "(min-width: 1280px)"
    )
    if (mediaQuery.matches) return

    const handleScroll = () => {
      railScrollAtRef.current = Date.now()
      if (scrollLocked) return // 🔒 prevent flash on tap

      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2

      let closestIndex = 0
      let closestDistance = Infinity

      thumbnailRefs.current.forEach((thumb, i) => {
        if (!thumb) return
        const thumbRect = thumb.getBoundingClientRect()
        const thumbCenter = thumbRect.left + thumbRect.width / 2
        const distance = Math.abs(containerCenter - thumbCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      })

      setSelectedIndex(closestIndex)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [images.length, scrollLocked])

  // Tap-centering effect
  useEffect(() => {
    if (!selectedByTap) return

    const container = containerRef.current
    const selectedThumb = thumbnailRefs.current[selectedIndex]
    if (!container || !selectedThumb) return

    const containerRect = container.getBoundingClientRect()
    const thumbRect = selectedThumb.getBoundingClientRect()

    const scrollAmount =
      thumbRect.left -
      containerRect.left -
      containerRect.width / 2 +
      thumbRect.width / 2

    container.scrollBy({
      left: scrollAmount,
      top: 0,
      behavior: "smooth",
    })

    // Unlock scroll after centering
    const timeout = setTimeout(() => setSelectedByTap(false), 300)
    return () => clearTimeout(timeout)
  }, [selectedIndex, selectedByTap])

  // Swiping to a still should stop the trailer — otherwise its audio keeps
  // playing underneath the photos.
  useEffect(() => {
    if (!hasLead || selectedIndex === 0) return
    videoRef.current?.pause()
  }, [selectedIndex, hasLead])

  // Preload images
  useEffect(() => {
    if (!images?.length) return
    images.forEach((img) => {
      if (!img?.asset) return
      const preload = new window.Image()
      preload.src = urlFor(img.asset)
        .width(1600)
        .quality(60)
        .fit("max")
        .url()
    })
  }, [images])

  // A lead video with no stills is still a viewer (the no-thumbnail video
  // pages lock on it at xg); only bail when there is nothing to show at all.
  if (!images?.length && !hasLead) return null

  return (
    <>
      {deskLock && DESK_LOCK_DEBUG && (
        <pre
          ref={debugRef}
          className="hidden xl:block fixed top-1/2 left-2 z-[999] bg-black text-white text-[11px] p-2 pointer-events-none max-w-[95vw] whitespace-pre-wrap"
        >
          debug: waiting for wheel…
        </pre>
      )}
      {/* "Submit" — the way back to the folio grid. A standing link (same
          treatment on every folio project page, incl. journals and no-stills
          videos): top-left where the nav's first link would sit, clear of the
          announcement bar. */}
      {deskLock && (
        <div
          style={{ top: "var(--announcement-h, 0px)" }}
          className="fixed left-0 py-4 px-7 z-50 hidden xg:block"
        >
          <TextDistortFilter>
            <TransitionLink
              href="/"
              className="uppercase hover:line-through text-[12px] text-black mix-blend-difference font-nav"
            >
              Submit
            </TransitionLink>
          </TextDistortFilter>
        </div>
      )}
      {/* deskLock trues up the centring: the rail (59px) + gap (30px) pull the
          stage left, so pad the same 89px on the left; and the 64px the page
          leaves below the viewer is matched with 64px on top, so the contained
          image centres on the viewport on both axes. */}
      {/* Scroll-drive wrappers: the outer zone allocates the scroll distance
          (one SLIDE_PX per slide step, plus the page wrapper's 4rem bottom
          margin as a tail). The inner box pins with position:fixed while the
          zone is engaged — NOT sticky: BaseLayout wraps every page in
          overflow-hidden ancestors, which silently break sticky (it pins to
          them, not the viewport). Fixed ignores ancestors; the zone keeps its
          explicit height, so nothing jumps when the box leaves the flow. The
          scroll listener owns the engaged flag, so pin-on and pin-off happen
          exactly at the frame where the flow position equals the fixed one.
          Both wrappers are inert plain divs outside scroll-drive mode. */}
      <div
        ref={zoneRef}
        style={
          scrollDrive
            ? { height: `calc(100vh + ${zoneScrollHeight}px + 4rem)` }
            : undefined
        }
      >
      <div
        ref={pinRef}
        style={
          scrollDrive
            ? deskLocked
              ? { position: "fixed", top: 0, left: 0, right: 0, height: "100vh", zIndex: 10 }
              : { height: "100vh" }
            : undefined
        }
      >
      <div ref={rootRef} className={`relative w-full h-[calc(100vh-4rem)] flex flex-col bar-hide xl:h-[calc(100vh-4rem)] ${deskLock ? "xg:flex-row xg:gap-7.5 xg:pt-16" : "lg:flex-row lg:gap-7.5 xl:pt-6"}`}>
        <div
          ref={mainImageRef}
          className={`flex-1 flex justify-center items-end overflow-hidden scrollbar-hide pt-12 p-6 md:px-20 ${deskLock ? "xg:items-center xg:p-0 xg:pl-[89px]" : "lg:items-center lg:p-0"}`}
        >
          <figure className="relative w-full h-full overflow-hidden">
            {hasLead && (() => {
              const offset = offsetFor(0)
              return (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${WIPE ? "" : "will-change-transform"}`}
                  style={WIPE ? wipeStyle(0, true) : {
                    transform: `translateY(${offset * 100}%)`,
                    opacity: offset === 0 ? 1 : 0,
                    transition:
                      Math.abs(offset) <= 1
                        ? "transform 500ms ease-out, opacity 500ms ease-out"
                        : "none",
                  }}
                >
                  <MuxPlayer
                    ref={videoRef}
                    playbackId={leadVideo!.playbackId}
                    streamType="on-demand"
                    autoPlay={false}
                    // xl:h-full: with only a max-height, a wide stage lets the
                    // player's internal controller keep the video's natural
                    // aspect height and overflow the box — shoving the control
                    // bar below the viewport. An explicit height letterboxes
                    // the video inside the controller and keeps the chrome
                    // visible. Left alone below xl, where slides are narrow
                    // enough that natural height always fits.
                    className="w-full max-h-full xg:h-full object-contain"
                  />
                </div>
              )
            })()}
            {images.map((img, i) => {
              const slideIndex = i + leadOffset
              const fullSrc = urlFor(img.asset).width(1600).quality(60).url()
              // On mobile, portraits fill the frame (cover) but landscape images
              // keep their natural short proportions (contain) instead of being
              // scaled up to portrait height. Desktop always contains.
              const dims = img.asset.metadata?.dimensions
              const isLandscape = dims ? dims.width > dims.height : false
              const offset = offsetFor(slideIndex)
              return (
                <div
                  key={i}
                  className={`absolute inset-0 ${WIPE ? "" : "will-change-transform"}`}
                  style={WIPE ? wipeStyle(slideIndex, loaded[i]) : {
                    // Vertical slide + crossfade: the selected image slides to
                    // centre and fades in; its neighbours slide away and fade out.
                    transform: `translateY(${offset * 100}%)`,
                    // Hold the slide transparent until its photo has decoded so
                    // it fades in like the rest of the site instead of popping.
                    opacity: offset === 0 && loaded[i] ? 1 : 0,
                    // Only the on-screen neighbours animate; off-screen images
                    // (incl. the one that wraps sides) snap so nothing flashes across.
                    transition:
                      Math.abs(offset) <= 1
                        ? "transform 500ms ease-out, opacity 500ms ease-out"
                        : "none",
                  }}
                >
                  <img
                    src={fullSrc}
                    alt={img.alt || title || ""}
                    ref={(el) => catchAlreadyLoaded(el, i)}
                    onLoad={() => handleLoad(i)}
                    // A broken image must not leave the slide permanently blank.
                    onError={() => handleLoad(i)}
                    // Cover only applies to portrait photos on a PORTRAIT
                    // viewport — in landscape orientation the stage is a wide
                    // short band and cover cropped the photo top and bottom.
                    className={`absolute inset-0 w-full h-full lg:object-contain ${
                      isLandscape
                        ? "object-contain"
                        : "object-cover landscape:object-contain"
                    }`}
                    draggable={false}
                  />
                </div>
              )
            })}
          </figure>
        </div>

        <div
          ref={containerRef}
          // lg:snap-y: manual drags on the vertical rail settle on a thumb,
          // like the horizontal filmstrip. xg:justify-start (not center): a
          // centred flex container with overflowing content clips its top
          // items UNREACHABLY — on landscape iPads the first thumbs could
          // never be scrolled to.
          className={`flex overflow-x-auto overflow-visible snap-x pl-[50vw] pr-[50vw] scrollbar-hide snap-proximity ${deskLock ? "xg:snap-y xg:w-[59px] xg:h-full xg:overflow-y-auto xg:flex-col xg:px-0 xg:pb-0 xg:mx-0 xg:pt-0 xg:justify-start" : "lg:snap-y lg:w-[59px] lg:h-full lg:overflow-y-auto lg:flex-col lg:px-0 lg:pb-0 lg:mx-0 lg:pt-0 lg:justify-center xg:justify-start"}`}
        >
          {hasLead && (
            <button
              ref={(el) => {
                thumbnailRefs.current[0] = el
              }}
              onClick={() => {
                if (Date.now() - railScrollAtRef.current < 150) return
                // Scroll-drive: the page position owns the index, so move it.
                if (scrollDrive) scrollToSlide(0)
                setSelectedByTap(true)
                setScrollLocked(true)
                setSelectedIndex(0)
                setTimeout(() => setScrollLocked(false), 300)
              }}
              className={`relative snap-center flex-shrink-0 overflow-hidden h-20 w-auto ${deskLock ? "xg:w-full xg:h-auto" : "lg:w-full lg:h-auto"}`}
              aria-label="Select video"
            >
              {/* Mux serves a still from the video itself, so the rail shows the
                  trailer rather than a placeholder. */}
              <img
                src={`https://image.mux.com/${leadVideo!.playbackId}/thumbnail.png?width=400`}
                alt={title ? `${title} video` : "Video"}
                className={`h-full w-auto object-contain ${deskLock ? "xg:w-full xg:h-auto" : "lg:w-full lg:h-auto"}`}
                draggable={false}
              />
              {selectedIndex === 0 && (
                <TextDistortFilter className="pointer-events-none absolute inset-0 z-10">
                  <div className="h-full w-full outline outline-2 outline-white outline-offset-[-2px]" />
                </TextDistortFilter>
              )}
            </button>
          )}
          {images.map((img, i) =>
            img?.asset ? (
              <button
                key={i}
                ref={(el) => {
                  thumbnailRefs.current[i + leadOffset] = el
                }}
                onClick={() => {
                  if (Date.now() - railScrollAtRef.current < 150) return
                  // Scroll-drive: the page position owns the index, so move it.
                  if (scrollDrive) scrollToSlide(i + leadOffset)
                  setSelectedByTap(true)
                  setScrollLocked(true)
                  setSelectedIndex(i + leadOffset)
                  setTimeout(() => setScrollLocked(false), 300)
                }}
                className={`relative snap-center flex-shrink-0 overflow-hidden h-20 w-auto ${deskLock ? "xg:w-full xg:h-auto" : "lg:w-full lg:h-auto"} ${
                  i + leadOffset === slideCount - 1 ? (deskLock ? "xg:mb-12" : "lg:mb-12") : ""
                }`}
                aria-label={`Select image ${i + 1}`}
              >
                <Image
                  src={urlFor(img.asset).width(400).auto("format").quality(75).url()}
                  alt={img.alt || title || ""}
                  width={img.asset.metadata?.dimensions?.width || 400}
                  height={img.asset.metadata?.dimensions?.height || 400}
                  placeholder="blur"
                  blurDataURL={img.asset.metadata?.lqip}
                  className={`h-full w-auto object-contain ${deskLock ? "xg:w-full xg:h-auto" : "lg:w-full lg:h-auto"}`}
                />
                {i + leadOffset === selectedIndex && (
                  <TextDistortFilter className="pointer-events-none absolute inset-0 z-10">
                    <div className="h-full w-full outline outline-2 outline-white outline-offset-[-2px]" />
                  </TextDistortFilter>
                )}
              </button>
            ) : null
          )}
        </div>
      </div>
      </div>
      </div>

      {!hideArrows && (
        <div
          className={`fixed bottom-0 left-0 right-0 h-16 flex-row justify-between z-50 items-center px-8 font-nav pointer-events-none transition-opacity duration-300 ${
            deskLock ? "hidden xg:flex" : "hidden xl:flex"
          } ${deskLock && !deskLocked ? "opacity-0" : ""}`}
        >
          {deskLock ? (
            /* Locked mode drops Down/Up (scrolling does that job) and puts
               "Info" where Down sat: the ONLY way out of the lock — it
               restores the text column and glides back up to it. */
            <>
              <TextDistortFilter>
                <button
                  type="button"
                  onClick={releaseLock}
                  className={`text-[12px] cursor-pointer uppercase hover:underline ${
                    deskLocked ? "pointer-events-auto" : ""
                  }`}
                >
                  Info
                </button>
              </TextDistortFilter>
              {/* "Don't Stop" — on to the next folio entry. justify-between
                  puts it bottom-right, opposite Info; it shares the bar's fade
                  so it only reads (and clicks) while locked. */}
              {nextHref && (
                <TextDistortFilter>
                  <TransitionLink
                    href={nextHref}
                    className={`text-[12px] uppercase hover:underline ${
                      deskLocked ? "pointer-events-auto" : ""
                    }`}
                  >
                    {"Don't Stop"}
                  </TransitionLink>
                </TextDistortFilter>
              )}
            </>
          ) : (
            <>
              <TextDistortFilter>
                <button
                  type="button"
                  onClick={goNext}
                  className="pointer-events-auto text-[12px] cursor-pointer uppercase hover:underline"
                >
                  Down
                </button>
              </TextDistortFilter>
              <TextDistortFilter>
                <button
                  type="button"
                  onClick={goPrev}
                  className="pointer-events-auto text-[12px] cursor-pointer uppercase hover:underline"
                >
                  Up
                </button>
              </TextDistortFilter>
            </>
          )}
        </div>
      )}
    </>
  )
}
