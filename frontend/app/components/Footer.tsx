import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="fixed lg:hidden bottom-0 left-0 right-0 py-4 px-7 w-full ">
     <div className="flex w-full justify-center">
      <Link href={"/"}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={225}
          height={30}
          className="object-contain dark:invert mix-blend-difference"
        />
      </Link>
    </div>
    </footer>
  )
}
