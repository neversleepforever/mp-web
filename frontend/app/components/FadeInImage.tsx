"use client"

import Image, { ImageProps } from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

interface FadeInImageProps extends ImageProps {
  blurDataURL?: string
  className?: string
}

export default function FadeInImage({
  className = "",
  blurDataURL,
  ...props
}: FadeInImageProps) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const markLoaded = useCallback((img: HTMLImageElement) => {
    img.setAttribute("data-loaded", "true")
    setLoaded(true)
  }, [])

  // An image that finishes decoding before React attaches onLoad — a cached
  // image, a back-navigation, or anything served fast — never fires the event,
  // which used to leave it stuck at opacity-0 forever. Catch that on mount.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) markLoaded(img)
  }, [markLoaded])

  return (
    <Image
      {...props}
      ref={imgRef}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      draggable={false}
      className={`${className} transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
      onLoad={(e) => markLoaded(e.currentTarget)}
    />
  )
}
