import Image from "next/image"

interface RatesProps {
  title?: React.ReactNode
}

export default function Rates({ title }: RatesProps) {
  return (
    <div
  className="
    grid grid-rows-4 grid-cols-8 gap-0 font-display py-5
    xl:flex xl:flex-row xl:items-center xl:justify-center xl:gap-4
    w-full overflow-hidden max-w-[300px] xl:max-w-full
    mx-auto place-items-center md:grayscale
  "
>
  {/* Left cards */}
  <div className="row-start-1 row-end-2 col-start-3 col-end-7 flex items-center justify-center gap-4 xl:w-auto">
    <div className="relative w-[55px] h-[35px] xl:w-[45px] xl:h-[30px]">
      <Image
        src="/images/discover.jpg"
        alt="Discover"
        fill
        sizes="55px"
        className="object-contain"
      />
    </div>
    <div className="relative shrink-0 w-[55px] h-[35px] xl:w-[45px] xl:h-[30px]">
      <Image
        src="/images/amex.jpg"
        alt="Amex"
        fill
        sizes="55px"
        className="object-contain"
      />
    </div>
  </div>

  {/* Left $$ */}
  <div className="row-start-1 row-end-5 col-start-1 col-end-3 flex items-center justify-end">
    <div className="flex flex-col justify-center gap-2 xl:gap-0 text-[47px] xl:text-[38px] xl:flex-row">
      <span>$</span>
      <span>$</span>
    </div>
  </div>

  {/* Title */}
  <div className="row-start-2 row-end-4 col-start-3 col-end-7 flex items-center justify-center font-display uppercase text-[36px] sm:text-[42px]">
    {title}
  </div>

  {/* Right $$ */}
  <div className="row-start-1 row-end-5 col-start-7 col-end-9 flex items-center justify-start">
    <div className="flex flex-col justify-center gap-2 xl:gap-0 xl:text-[38px] text-[47px] xl:flex-row">
      <span>$</span>
      <span>$</span>
    </div>
  </div>

  {/* Right cards */}
  <div className="row-start-4 row-end-5 col-start-3 col-end-7 flex items-center justify-center gap-4 xl:w-auto">
    <div className="relative shrink-0 w-[55px] h-[35px] xl:w-[45px] xl:h-[30px]">
      <Image
        src="/images/mastercard.jpg"
        alt="MasterCard"
        fill
        sizes="55px"
        className="object-contain"
      />
    </div>
    <div className="relative w-[55px] h-[35px] xl:w-[45px] xl:h-[30px]">
      <Image
        src="/images/visa.jpg"
        alt="Visa"
        fill
        sizes="55px"
        className="object-contain"
      />
    </div>
  </div>
</div>

  )
}