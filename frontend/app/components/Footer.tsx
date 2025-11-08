import Link from "next/link"
import Image from "next/image"
import TextDistortFilter from "./TextFilter"

export default function Footer() {
  return (
      <footer className="fixed  bottom-0 left-0 right-0 py-4 px-7 w-full ">
        <TextDistortFilter>
          <div className="flex w-full justify-center lg:justify-between x-50 mix-blend-exclusion ">
            <Link href={"/folio"} className="uppercase hover:underline text-[14px] text-black mix-blend-difference">Folio</Link>
            <Link href={"/"} className="lg:hidden">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={225}
                height={30}
                className="object-contain dark:invert"
              />
            </Link>
            <Link href={"/"} className="uppercase hover:underline text-[14px] text-black mix-blend-difference">View Full Shoot</Link>
          </div>
      
        </TextDistortFilter>
      </footer>
   
  )
}
