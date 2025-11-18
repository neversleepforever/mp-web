"use client"
import { useState, useEffect } from "react"

export default function AgeCheck({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // const isVerified = localStorage.getItem("age-verified")
    // if (isVerified === "true") setVerified(true)
    setLoaded(true)
  }, [])

  const handleVerify = () => {
    localStorage.setItem("age-verified", "true")
    setVerified(true)
  }

  if (!loaded) {
    return null
  }

  return (
    <div className="relative">
      {children}
      {!verified && (
        <div className="fixed inset-0 h-full w-full flex items-center justify-center backdrop-blur-lg z-[9999]">
          <div className="bg-black text-white text-center w-full py-5 px-1 font-display uppercase">
            <h2 className="text-xl">
              The following content is for 18+ adults only —{" "}
              <button
                onClick={handleVerify}
                className="uppercase underline decoration-1 hover:decoration-2 transition-all cursor-pointer"
              >
                Proceed
              </button>
            </h2>
          </div>
        </div>
      )}
    </div>
  )
}
