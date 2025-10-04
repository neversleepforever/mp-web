"use client"

import React from "react"

export default function TextDistortFilter({
  children,
  className = "",
  scale = 2,
}: {
  children: React.ReactNode
  className?: string
  scale?: number
}) {
  return (
    <>
      {/* Wrapper applying the SVG filter */}
      <div style={{ filter: `url(#text-distort)` }} className={className}>
        {children}
      </div>

      {/* Hidden SVG definition — same as your previous HTML filter */}
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
            />
          </filter>
        </defs>
      </svg>
    </>
  )
}
