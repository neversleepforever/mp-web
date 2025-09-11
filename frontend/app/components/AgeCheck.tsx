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
          <div className="bg-black text-white text-center w-full p-6">
            <h2 className="text-xl mb-4">This site contains 18+ content</h2>
            <button
              onClick={handleVerify}
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200"
            >
              Enter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
