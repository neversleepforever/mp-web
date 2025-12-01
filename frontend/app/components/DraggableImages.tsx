"use client"

import { useRef, useState } from "react"
import FadeInImage from "./FadeInImage"
import { TransitionLink } from "./TransitionLink"

interface DraggableImageProps {
  image: any
  className: string
}

function DraggableImage({ image, className }: DraggableImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const [dragging, setDragging] = useState(false)

  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const pointerDownAt = useRef({ x: 0, y: 0 }) // used for synchronous movement checks
  const DRAG_THRESHOLD = 3
  const didDrag = useRef(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return

    el.setPointerCapture(e.pointerId)

    // store the raw down coords for synchronous checks
    pointerDownAt.current = { x: e.clientX, y: e.clientY }

    startPos.current = {
      x: e.clientX - currentPos.current.x,
      y: e.clientY - currentPos.current.y,
    }

    // reset flags
    setDragging(false)
    didDrag.current = false
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    // do NOT use e.pressure (Safari unreliable). For mouse require button pressed.
    if (e.pointerType === "mouse" && e.buttons === 0) return

    const el = ref.current
    if (!el) return

    const x = e.clientX - startPos.current.x
    const y = e.clientY - startPos.current.y

    // synchronous movement detection using pointerDownAt
    const dx = e.clientX - pointerDownAt.current.x
    const dy = e.clientY - pointerDownAt.current.y
    if (!didDrag.current && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      didDrag.current = true
      setDragging(true)
    }

    currentPos.current = { x, y }
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return

    el.releasePointerCapture(e.pointerId)

    // find anchor inside wrapper (TransitionLink renders an <a>)
    const link = el.querySelector("a") as HTMLAnchorElement | null

    if (didDrag.current) {
      // If we did drag, prevent the synthetic click that Safari may create.
      e.preventDefault()
      // don't trigger navigation
    } else {
      // No drag -> trigger the link immediately and synchronously.
      // Prevent default so Safari/other browsers don't also synthesize a second click.
      e.preventDefault()

      if (link) {
        // Dispatch a real MouseEvent so listeners (including TransitionLink's onClick)
        // see it as a user gesture.
        link.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        )
      }
    }

    // Reset dragging next tick (keeps UI state updates after pointer events)
    requestAnimationFrame(() => {
      setDragging(false)
      didDrag.current = false
    })
  }

  // block all native clicks so Safari cannot navigate via ghost clicks
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      ref={ref}
      className={`cursor-grab active:cursor-grabbing will-change-transform transform-gpu ${className}`}
      style={{ touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick} // completely block click events from reaching the anchor naturally
    >
      <TransitionLink href={image.link || "/"} className="pointer-events-none cursor-inherit">
        <FadeInImage
          src={image.image.asset.url}
          alt={image.alt || ""}
          width={500}
          height={500}
          blurDataURL={image.image.asset.metadata?.lqip}
          draggable={false}
          className="pointer-events-none"
        />
      </TransitionLink>
    </div>
  )
}

interface HomeData {
  image1: any
  image2: any
  image3: any
  image4: any
}

export default function DraggableImages({ home }: { home: HomeData }) {
  return (
    <>
      <DraggableImage
        image={home.image1}
        className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-1 xl:col-start-1 xl:row-start-1 -rotate-7 -translate-x-7 md:-translate-x-16 lg:translate-x-0 xl:translate-x-0 md:translate-y-6 lg:translate-y-0 xl:translate-y-8 scale-110 lg:scale-120 xl:scale-120 md:scale-95 z-10 drop-shadow-lg/50 lg:row-start-1 lg:col-start-1 lg:row-span-3 lg:col-span-3"
      />
      <DraggableImage
        image={home.image2}
        className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-3 xl:col-start-2 xl:row-start-1 rotate-5 xl:rotate-0 translate-x-16 md:translate-x-24 lg:translate-x-0 xl:translate-x-0 xl:-translate-y-14 scale-110 md:scale-95 lg:scale-120 xl:scale-120 drop-shadow-lg/50 lg:row-start-1 lg:col-start-4 lg:row-span-3 lg:col-span-3"
      />
      <DraggableImage
        image={home.image3}
        className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-1 row-start-3 xl:col-start-3 xl:row-start-1 -rotate-5 md:-rotate-8 xl:rotate-0 -translate-x-7 md:-translate-x-16 lg:translate-x-0 xl:translate-x-0 -translate-y-7 xl:translate-y-4 scale-110 md:scale-95 lg:scale-120 xl:scale-120 z-30 drop-shadow-lg/50 lg:row-start-3 lg:col-start-1 lg:row-span-3 lg:col-span-3"
      />
      <DraggableImage
        image={home.image4}
        className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-3 row-start-3 xl:col-start-4 xl:row-start-1 rotate-15 xl:rotate-8 translate-x-16 md:translate-x-36 lg:translate-x-0 xl:translate-x-0 -translate-y-8  xl:translate-y-0 scale-110 md:scale-95 lg:scale-120 xl:scale-120 z-20 drop-shadow-lg/50 lg:row-start-3 lg:col-start-4 lg:row-span-3 lg:col-span-3"
      />
    </>
  )
}
