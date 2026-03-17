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
  const [safari, setSafari] = useState(false)

  useEffect(() => {
    setSafari(isSafari())
  }, [])

  const filterId = safari ? "text-distort-safari" : "text-distort"

  return (
    <>
      <div style={{ filter: `url(#${filterId})` }} className={className}>
        {children}
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <defs>
          {/* Standard filter */}
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
            <feGaussianBlur in="displaced" stdDeviation={blur} />
          </filter>

          {/* Safari filter */}
          <filter id="text-distort-safari">
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
            />
          </filter>
        </defs>
      </svg>
    </>
  )
}