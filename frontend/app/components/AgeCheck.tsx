"use client"
import { useState, useEffect } from "react"
import Marquee from "react-fast-marquee";
import TextDistortFilter from "./TextFilter";

// GROQ returns null for an unset field, not undefined — the `??` fallbacks below
// handle either.
type AgeCheckContent = {
  marqueeText?: string | null
  bodyText?: string | null
  buttonText?: string | null
}

export default function AgeCheck({
    children,
    content,
  }: {
    children: React.ReactNode
    content?: AgeCheckContent
  }) {
  const marqueeLabel = content?.marqueeText ?? "For Adults Only 🍑"
  const bodyLabel    = content?.bodyText    ?? "The following content is for 18+ adults only —"
  const buttonLabel  = content?.buttonText  ?? "Proceed"
  const [verified, setVerified] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [isXL, setIsXL] = useState(false);
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

const handleVerify = () => {
  const payload = {
    verified: true,
    ts: Date.now()
  };

  localStorage.setItem("age-verified", JSON.stringify(payload));
  setVerified(true);
};

  useEffect(() => {
    const onResize = () => {
      setIsXL(window.innerWidth >= 1024);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);


    useEffect(() => {
    const raw = localStorage.getItem("age-verified");
    if (raw) {
      const data = JSON.parse(raw);
      if (data.verified && Date.now() - data.ts < THIRTY_DAYS) {
        setVerified(true);
      }
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return null
  }

  // Render the Sanity value. This was previously hardcoded, so marqueeLabel was
  // read from the CMS and then discarded — edits to marqueeText never appeared.
  const marqueeText = (<div className="pl-2">{marqueeLabel}</div>)

  return (
    <>
    <div className="relative">
      {children}
      {!verified && (
        <>
        <div className="fixed inset-0 h-full w-full flex items-center justify-center backdrop-blur-lg z-[800]">
          {/* w-full on the filter wrapper: as a flex item it otherwise
              shrink-wraps its content, and the panel's own w-full then
              resolves against that instead of the viewport — the bar floated
              mid-screen on wide windows. */}
          <TextDistortFilter className="w-full">
          <div className="bg-black text-white text-center w-full py-3 px-1 font-display uppercase">
            
              <div className="grid place-items-center relative">
              {isXL && (
                <Marquee
                  gradient={false}
                  speed={75}
                  direction="right"
                  className="col-start-1 row-start-1 z-[100] font-sans text-[10px]"
                >
                  {marqueeText}
                  {marqueeText}
                  {marqueeText}
                  {marqueeText}
                  {marqueeText}
                  {marqueeText}
                  {marqueeText}
                  {marqueeText}
                  {marqueeText}
                  {marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}
                  {marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}
                </Marquee>
                   )}
                <div className="text-[10px] col-start-1 row-start-1 z-[800] text-center px-8 flex flex-row">
                  <div className="bg-black mask-l-from-30% z-[800] w-[30px]" />
                    <h2 className="bg-black"> 
                      {bodyLabel}{" "}
                      <button
                        onClick={handleVerify}
                        className="uppercase underline decoration-1 hover:decoration-2 transition-all cursor-pointer"
                      >
                        {buttonLabel}
                      </button>
                    </h2>
                  <div className="bg-black mask-r-from-30% z-[800] w-[30px]" />
                </div>
              </div>
  
          </div>
        </TextDistortFilter>
        </div>
        <div className="flex items-center justify-center font-sans text-[10px] uppercase h-[29px] text-white bg-black fixed top-0 left-0 right-0 z-[9999] lg:hidden">
          <TextDistortFilter><Marquee direction="right" gradient={false} speed={75}>{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}</Marquee></TextDistortFilter>
        </div>
        <div className="flex items-center justify-center font-sans text-[10px] uppercase h-[29px] text-white bg-black fixed bottom-0 left-0 right-0 z-[9999] lg:hidden">
          <TextDistortFilter><Marquee direction="right" gradient={false} speed={75}>{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}{marqueeText}</Marquee></TextDistortFilter>
        </div>
        </>
      )}
    </div>

  </>
  )
}
