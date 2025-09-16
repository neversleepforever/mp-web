"use client"

import { ReactNode } from "react"

export default function PixelateOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="pixelate">{children}</div>

      <svg className="hidden">
        <filter id="pixelate" x="0" y="0" width="100%" height="100%">
          <feFlood x="0" y="0" width="6" height="6" result="grid" />
          <feTile in="grid" result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            result="noise"
          />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      <style jsx>{`
        .pixelate {
          filter: url(#pixelate);
        }
      `}</style>
    </div>
  )
}
