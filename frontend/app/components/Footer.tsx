import Link from "next/link"
import Image from "next/image"
import TextDistortFilter from "./TextFilter"

export default function Footer() {
  return (
  
      <footer className="fixed lg:hidden bottom-0 left-0 right-0 py-4 px-7 w-full ">
        <TextDistortFilter>
        <Link href={"/"} className="">
          <div className="flex w-full justify-center x-50 mix-blend-exclusion">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={225}
              height={30}
              className="object-contain dark:invert"
            />
          </div>
        </Link>
        </TextDistortFilter>
      </footer>
   
  )
}
