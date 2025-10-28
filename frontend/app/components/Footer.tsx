import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="fixed lg:hidden bottom-0 left-0 right-0 z-40 py-4 px-7 w-full mix-blend-color-burn dark:mix-blend-luminosity z-50">
     <div className="flex w-full justify-center">
      <Link href={"/"}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={225}
          height={30}
          className="object-contain dark:invert"
        />
      </Link>
    </div>
    </footer>
  )
}
