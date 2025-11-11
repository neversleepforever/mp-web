"use client"

import React from "react"

export default function TextDistortFilter({
  children,
  className = "",
  scale = 3,
  blur = 0.3,
}: {
  children: React.ReactNode
  className?: string
  scale?: number
  blur?: number
}) {
  return (
    <>
      {/* Wrapper applying the SVG filter */}
      <div style={{ filter: `url(#text-distort)` }} className={className}>
        {children}
      </div>

      {/* Hidden SVG definition */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter id="text-distort">
            {/* Noise for distortion */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1 1"
              numOctaves="1"
              result="turbulence"
            />
            {/* Apply displacement */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={scale}
              result="displaced"
            />
            {/* Add slight blur */}
            <feGaussianBlur in="displaced" stdDeviation={blur} />
          </filter>
        </defs>
      </svg>
    </>
  )
}
