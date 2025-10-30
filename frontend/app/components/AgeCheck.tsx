"use client"
import { useState, useEffect } from "react"

export default function AgeCheck({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    // const isVerified = localStorage.getItem("age-verified")
    // if (isVerified === "true") setVerified(true)
  }, [])

  const handleVerify = () => {
    localStorage.setItem("age-verified", "true")
    setVerified(true)
  }

  return (
    <div className="relative z-[99]">
      {children}
      {!verified && (
        <div className="fixed inset-0 h-full w-full z-40 flex items-center justify-center backdrop-blur-lg z-[9999]">
          <div className="bg-black z-[9999]  text-white text-center w-full py-5 px-1 font-display uppercase">
            <h2 className="text-xl">
              The following content is for 18+ adults only –{" "}
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
