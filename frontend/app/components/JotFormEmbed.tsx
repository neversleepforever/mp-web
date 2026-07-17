"use client"

import { useEffect, useState } from "react"
import { preconnect, prefetchDNS } from "react-dom"

// Skeleton bars are filled with a tiled peach icon over a faint tint
const barFill =
  "rounded bg-white/5 bg-[url('/peachvector.png')] bg-[length:22px_22px] bg-repeat opacity-40"

export default function JotformEmbed({ formId }: { formId: string }) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [minElapsed, setMinElapsed] = useState(false)

  // Warm up the connection to Jotform before the iframe starts fetching
  prefetchDNS("https://form.jotform.com")
  preconnect("https://form.jotform.com")
  preconnect("https://cdn.jotfor.ms")

  // On mobile the lighter form loads fast enough that onLoad fires almost
  // instantly — hold the skeleton for a short minimum so it's perceptible.
  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), 700)
    return () => clearTimeout(t)
  }, [])

  const ready = iframeLoaded && minElapsed

  return (
    <div className="relative w-full">
      {!ready && (
        <div className="absolute inset-0 flex flex-col gap-6 px-2 py-8 pointer-events-none animate-pulse">
          {/* heading */}
          <div className={`h-5 w-1/2 ${barFill}`} />
          {/* field rows */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className={`h-3 w-1/4 ${barFill}`} />
              <div className={`h-10 w-full ${barFill}`} />
            </div>
          ))}
          {/* submit button */}
          <div className={`h-11 w-1/3 ${barFill}`} />
        </div>
      )}
      <iframe
        src={`https://form.jotform.com/${formId}?v=2`}
        onLoad={() => setIframeLoaded(true)}
        className={`block w-full border-none bg-transparent transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{ height: "3000px" }}
        scrolling="no"
        allowFullScreen
      />
    </div>
  )
}
