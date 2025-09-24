"use client"
import { useState, useEffect } from "react"

export default function AgeCheck({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    // const isVerified = localStorage.getItem("age-verified")
    // if (isVerified === "true") setVerified(true)
  }, [])

  const handleVerify = () => {
    // localStorage.setItem("age-verified", "true")
    setVerified(true)
  }

  return (
    <div className="relative">
      {children}
      {!verified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-black text-white text-center w-full py-5 px-1 font-display uppercase">
            <h2 className="text-xl">The following content is for 18+ adults only - <span><button
              onClick={handleVerify}
              className="uppercase underline"
            >
              Proceed
            </button></span></h2>
          </div>
        </div>
      )}
    </div>
  )
}
