import Image from "next/image"

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full mix-blend-color-burn dark:mix-blend-luminosity z-50">
        <Image
          src={"/images/nav.png"}
          alt={"Mistress Maggie Peach"}
          height={96}
          width={2000} 
          className="h-full w-auto object-contain"
        />
    </footer>
  )
}
