"use client"

import React from "react"

export default function Filter({
  children,
  className = "",
  stdDeviation = 3,
}: {
  children: React.ReactNode
  className?: string
  stdDeviation?: number
}) {
  return (
    <div
      style={{ filter: `url(#blurfilter)` }}
      className={className}
    >
      {children}
    </div>
  )
}
