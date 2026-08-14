"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import TextDistortFilter from "./TextFilter"
import { TransitionLink } from "./TransitionLink"

export default function Footer() {
  const pathname = usePathname()

  const isFolioPage = pathname?.startsWith("/folio")
  const isGalleryPage = pathname?.startsWith("/folio/gallery/")
  const isFullGalleryPage = pathname?.endsWith("/full")

  const fullGalleryHref = isGalleryPage
    ? `${pathname?.replace(/\/full$/, "")}/full`
    : null

  const backHref = isFolioPage ? "/folio" : null

  return (
    <footer className="fixed bottom-0 left-0 right-0 py-4 px-7 w-full z-40">
      <TextDistortFilter>
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 flex justify-start">
            {isFolioPage && !pathname.endsWith("/folio") && !isFullGalleryPage && (
              <TransitionLink
                href={backHref ?? "/folio"}
                className="uppercase hover:underline text-[14px] text-black mix-blend-difference"
              >
                Back
              </TransitionLink>
            )}
          </div>
          <div className=" h-[30px] flex-shrink-0 flex justify-center">
            <TransitionLink href={"/folio"}>
              <Image
                src="/images/logo/mistress-maggie-peach-1-line-black.svg"
                alt="Logo"
                width={180}
                height={24}
                className="object-contain dark:invert lg:hidden"
              />
            </TransitionLink>
          </div>
          <div className="flex-1 flex justify-end">
            {isGalleryPage && !isFullGalleryPage && (
              <TransitionLink
                href={fullGalleryHref ?? "#"}
                className="hidden lg:block uppercase hover:underline text-[14px] text-black mix-blend-difference"
              >
                View Full Shoot
              </TransitionLink>
            )}
          </div>

        </div>
      </TextDistortFilter>
    </footer>
  )
}
