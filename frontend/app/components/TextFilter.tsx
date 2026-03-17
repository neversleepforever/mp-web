"use client"

import React, { useEffect, useState } from "react"

function isSafari() {
  return (
    typeof window !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  )
}

export default function TextDistortFilter({
  children,
  className = "",
  scale = 3,
  blur = 0.2,
}: {
  children: React.ReactNode
  className?: string
  scale?: number
  blur?: number
}) {
  const [activeBlur, setActiveBlur] = useState(blur)

  useEffect(() => {
    setActiveBlur(isSafari() ? 0.0 : blur)
  }, [blur])

  return (
    <>
      <div style={{ filter: `url(#text-distort)` }} className={className}>
        {children}
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter id="text-distort">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1 1"
              numOctaves="1"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={scale}
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation={activeBlur} />
          </filter>
        </defs>
      </svg>
    </>
  )
}