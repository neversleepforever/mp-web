"use client"

import { useState } from "react"
import TextDistortFilter from "./TextFilter"

export type FaqItem = { question: string; answer: string }

/** FAQ accordion rows for the Policies & FAQs page. Each row is a bordered box
 *  continuing the policy stack's rule: question left, an Open/Close toggle
 *  right (Sharp Sans, like the nav), answer revealed beneath. Rows toggle
 *  independently — the design's expanded state shows several open at once.
 *  The distort filter wraps each row's text separately so a toggle only
 *  re-rasterises its own row. */
export default function FaqAccordion({
  items,
  heading = "FAQs",
}: {
  items: FaqItem[]
  heading?: string
}) {
  const [open, setOpen] = useState<boolean[]>(() => items.map(() => false))
  const allOpen = open.every(Boolean)

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })

  const toggleAll = () => setOpen(items.map(() => !allOpen))

  return (
    <>
      {/* The section's black title bar lives here (not the page) so the
          master toggle shares the rows' state. Same padding as the rows, so
          Open All sits flush with the per-row toggle column. */}
      <div className="bg-black px-[30px] py-[24px] flex items-center justify-between gap-6">
        <TextDistortFilter>
          <h2 className="font-display font-extrabold text-[40px] leading-[37px] text-white uppercase text-justify">
            {heading}
          </h2>
        </TextDistortFilter>
        <button type="button" onClick={toggleAll} className="cursor-pointer shrink-0">
          <TextDistortFilter>
            <span className="font-nav text-[14px] text-white uppercase hover:line-through">
              {allOpen ? "Close All" : "Open All"}
            </span>
          </TextDistortFilter>
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="border-b-2 border-l-2 border-r-2 border-black border-solid px-[30px] py-[24px]"
        >
          <button
            type="button"
            onClick={() => toggle(i)}
            aria-expanded={open[i]}
            className="w-full cursor-pointer"
          >
            <TextDistortFilter>
              <div className="flex items-center justify-between gap-6 text-black uppercase">
                <span className="font-display font-extrabold text-[22px] leading-[normal] text-left">
                  {item.question}
                </span>
                <span className="font-nav text-[14px] shrink-0 hover:line-through">
                  {open[i] ? "Close" : "Open"}
                </span>
              </div>
            </TextDistortFilter>
          </button>
          {/* Drawer reveal in the hero wipe's language: a masking edge travels
              down (the row grows, overflow clips), same ease-in-out family.
              The 0fr→1fr grid trick animates to auto height with no measuring.
              The distort filter sits INSIDE the clip, so the filtered subtree
              never changes during the animation — no per-frame re-raster. */}
          <div
            className={`grid transition-[grid-template-rows] duration-700 ease-in-out ${
              open[i] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div
              className={`overflow-hidden transition-opacity duration-700 ease-in-out ${
                open[i] ? "opacity-100" : "opacity-0"
              }`}
            >
              <TextDistortFilter>
                <p className="pt-[12px] font-sans text-[22px] leading-[normal] text-black text-justify">
                  {item.answer}
                </p>
              </TextDistortFilter>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
