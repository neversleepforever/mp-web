"use client"

import { useRef, useState } from "react"
import Draggable from "react-draggable"
import FadeInImage from './FadeInImage'
import { useRouter } from "next/navigation"

interface DraggableImageProps {
  image: any
  className: string
}

function DraggableImage({ image, className }: DraggableImageProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const router = useRouter()

  const handleDrag = (e: any, data: any) => {
    if (Math.abs(data.x) > 2 || Math.abs(data.y) > 2) setDragging(true)
  }

  const handleStop = () => {
    setTimeout(() => setDragging(false), 0) // reset dragging after release
  }

  const handleClick = () => {
    if (!dragging) {
      router.push(image.link || '/')
    }
  }

  return (
    <Draggable nodeRef={nodeRef} onDrag={handleDrag} onStop={handleStop}>
      <div ref={nodeRef} onClick={handleClick} className={`cursor-grab ${className}`}>
        <FadeInImage
          src={image.image.asset.url}
          alt={image.alt || ""}
          width={500}
          height={500}
          blurDataURL={image.image.asset.metadata?.lqip}
          draggable={false}
        />
      </div>
    </Draggable>
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
      <DraggableImage image={home.image1} className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-1 xl:col-start-1 xl:row-start-1 -rotate-5 -translate-x-7 xl:translate-x-0 xl:translate-y-8 scale-110 xl:scale-115 md:scale-90 drop-shadow-lg/50" />
      <DraggableImage image={home.image2} className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 row-start-1 col-start-3 xl:col-start-2 xl:row-start-1 rotate-5 xl:rotate-0 translate-x-12 xl:translate-x-0 xl:-translate-y-8 scale-110 md:scale-90 xl:scale-115 drop-shadow-lg/50" />
      <DraggableImage image={home.image3} className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-1 row-start-3 xl:col-start-3 xl:row-start-1 -rotate-5 xl:rotate-0 -translate-x-7 xl:translate-x-0 -translate-y-7 xl:translate-y-4 scale-110 md:scale-90 xl:scale-115 z-30 drop-shadow-lg/50" />
      <DraggableImage image={home.image4} className="xl:flex xl:items-center xl:justify-center col-span-4 xl:col-span-1 col-start-3 row-start-3 xl:col-start-4 xl:row-start-1 rotate-15 xl:rotate-8 translate-x-16 xl:translate-x-0 -translate-y-8 xl:translate-y-0 scale-110 md:scale-90 xl:scale-115 z-20 drop-shadow-lg/50" />
    </>
  )
}
