"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"

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

  return (
    <Image
      {...props}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      className={`${className} transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
      onLoadingComplete={(img) => {
        img.setAttribute("data-loaded", "true")
        setLoaded(true)
      }}
    />
  )
}
