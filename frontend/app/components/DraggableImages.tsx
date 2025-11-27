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
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [dragging, setDragging] = useState(false)

  const startPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const DRAG_THRESHOLD = 3

  const handlePointerDown = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return

    el.setPointerCapture(e.pointerId)

    startPos.current = {
      x: e.clientX - currentPos.current.x,
      y: e.clientY - currentPos.current.y,
    }

    setDragging(false)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pressure === 0) return

    const el = ref.current
    if (!el) return

    const x = e.clientX - startPos.current.x
    const y = e.clientY - startPos.current.y

    if (!dragging) {
      if (
        Math.abs(x - currentPos.current.x) > DRAG_THRESHOLD ||
        Math.abs(y - currentPos.current.y) > DRAG_THRESHOLD
      ) {
        setDragging(true)
      }
    }

    currentPos.current = { x, y }
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return

    el.releasePointerCapture(e.pointerId)

    // Reset dragging next tick
    requestAnimationFrame(() => setDragging(false))
  }

  const handleClick = (e: React.MouseEvent) => {
    console.log("click", e, dragging);
    if (dragging) {
      e.preventDefault()
      e.stopPropagation()
    } else {
        const link = ref.current?.querySelector('a')
        link?.click()
    }
  }

  return (
    <div
      ref={ref}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: "none" }} 
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
    >
      <TransitionLink   href={image.link || "/"} >
        <FadeInImage
          src={image.image.asset.url}
          alt={image.alt || ""}
          width={500}
          height={500}
          blurDataURL={image.image.asset.metadata?.lqip}
          draggable={false}
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
        className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-1 xl:col-start-1 xl:row-start-1 -rotate-5 -translate-x-7 xl:translate-x-0 xl:translate-y-8 scale-110 xl:scale-115 md:scale-90 drop-shadow-lg/50"
      />
      <DraggableImage
        image={home.image2}
        className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-3 xl:col-start-2 xl:row-start-1 rotate-5 xl:rotate-0 translate-x-12 xl:translate-x-0 xl:-translate-y-8 scale-110 md:scale-90 xl:scale-115 drop-shadow-lg/50"
      />
      <DraggableImage
        image={home.image3}
        className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-1 row-start-3 xl:col-start-3 xl:row-start-1 -rotate-5 xl:rotate-0 -translate-x-7 xl:translate-x-0 -translate-y-7 xl:translate-y-4 scale-110 md:scale-90 xl:scale-115 z-30 drop-shadow-lg/50"
      />
      <DraggableImage
        image={home.image4}
        className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-3 row-start-3 xl:col-start-4 xl:row-start-1 rotate-15 xl:rotate-8 translate-x-16 xl:translate-x-0 -translate-y-8 xl:translate-y-0 scale-110 md:scale-90 xl:scale-115 z-20 drop-shadow-lg/50"
      />
    </>
  )
}
