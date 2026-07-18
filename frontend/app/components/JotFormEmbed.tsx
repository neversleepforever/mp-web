"use client"

import { useEffect, useState } from "react"
import { preconnect, prefetchDNS } from "react-dom"

// Faint bar with a highlight sweeping across it (see .skeleton-bar in globals.css)
const barFill = "rounded skeleton-bar"

export default function JotformEmbed({ formId }: { formId: string }) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [minElapsed, setMinElapsed] = useState(false)
  // Start tall enough to avoid an initial visible reflow; Jotform's postMessage
  // corrects this to the real content height once the form settles.
  const [height, setHeight] = useState(3000)

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

  // Jotform posts "setHeight:<px>:<formId>" whenever the form reflows. Size the
  // iframe to match so tall mobile forms aren't clipped and the submit button
  // stays reachable. Without this the fixed height clips content past 3000px.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!/jotform/.test(e.origin)) return
      const data = typeof e.data === "string" ? e.data : ""
      if (!data.startsWith("setHeight")) return
      const parts = data.split(":")
      const next = Number(parts[1])
      if (Number.isFinite(next) && next > 0) setHeight(next)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const ready = iframeLoaded && minElapsed

  return (
    <div className="relative w-full">
      {!ready && (
        <div className="absolute inset-0 flex flex-col gap-8 px-6 pt-[68px] pb-8 md:pt-13 pointer-events-none">
          {/* title block — mirrors the large "MISTRESS MAGGIE PEACH" heading */}
          <div className="flex flex-col gap-3">
            <div className={`h-9 w-4/5 ${barFill}`} />
            <div className={`h-9 w-3/5 ${barFill}`} />
            <div className={`mt-2 h-5 w-2/5 ${barFill}`} />
          </div>
          {/* intro paragraph */}
          <div className="flex flex-col gap-2.5">
            {["w-full", "w-full", "w-11/12", "w-3/4"].map((w, i) => (
              <div key={i} className={`h-3.5 ${w} ${barFill}`} />
            ))}
          </div>
          {/* section heading + fields — enough rows to fill the viewport so
              there's no dead gap below while loading */}
          <div className="mt-2 flex flex-col gap-6">
            <div className={`h-5 w-1/3 ${barFill}`} />
            {["w-1/3", "w-2/5", "w-1/2", "w-2/5", "w-1/3", "w-1/2"].map((w, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className={`h-3 ${w} ${barFill}`} />
                <div className={`h-11 w-full ${barFill}`} />
              </div>
            ))}
          </div>
        </div>
      )}
      <iframe
        src={`https://form.jotform.com/${formId}?v=2`}
        onLoad={() => setIframeLoaded(true)}
        className={`block w-full border-none bg-transparent transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{ height: `${height}px` }}
        scrolling="no"
        allowFullScreen
      />
    </div>
  )
}
