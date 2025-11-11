"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import TextDistortFilter from "./TextFilter"

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
    <footer className="fixed bottom-0 left-0 right-0 py-4 px-7 w-full">
      <TextDistortFilter>
        <div className="flex items-center justify-between w-full mix-blend-exclusion">
          <div className="flex-1 flex justify-start">
            {isFolioPage && !pathname.endsWith("/folio") && !isFullGalleryPage && (
              <Link
                href={backHref ?? "/folio"}
                className="uppercase hover:underline text-[14px] text-black mix-blend-difference"
              >
                Back
              </Link>
            )}
          </div>
          <div className="flex-shrink-0 flex justify-center">
            <Link href={"/"}>
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={225}
                height={30}
                className="object-contain dark:invert lg:hidden"
              />
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            {isGalleryPage && !isFullGalleryPage && (
              <Link
                href={fullGalleryHref ?? "#"}
                className="hidden lg:block uppercase hover:underline text-[14px] text-black mix-blend-difference"
              >
                View Full Shoot
              </Link>
            )}
          </div>

        </div>
      </TextDistortFilter>
    </footer>
  )
}
