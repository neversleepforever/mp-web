import Image from "next/image"

interface RatesProps {
  title?: React.ReactNode
}

export default function Rates({ title }: RatesProps) {
  return (
    <div
  className="
    grid grid-rows-4 grid-cols-8 gap-0 font-display py-5
    lg:flex lg:flex-row lg:items-center lg:justify-center lg:gap-4
  "
>
  {/* Left cards */}
  <div className="row-start-1 row-end-2 col-start-3 col-end-7 flex items-center justify-center gap-4 lg:w-auto">
    <div className="relative w-[55px] h-[35px] lg:w-[45px] lg:h-[30px]">
      <Image
        src="/images/discover.jpg"
        alt="Discover"
        fill
        className="object-contain"
      />
    </div>
    <div className="relative w-[55px] h-[35px] lg:w-[45px] lg:h-[30px]">
      <Image
        src="/images/amex.jpg"
        alt="Amex"
        fill
        className="object-contain"
      />
    </div>
  </div>

  {/* Left $$ */}
  <div className="row-start-1 row-end-5 col-start-1 col-end-3 flex items-center justify-end">
    <div className="flex flex-col justify-center gap-2 lg:gap-0 text-[47px] lg:text-[38px] lg:flex-row">
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
    <div className="flex flex-col justify-center gap-2 lg:gap-0 lg:text-[38px] text-[47px] lg:flex-row">
      <span>$</span>
      <span>$</span>
    </div>
  </div>

  {/* Right cards */}
  <div className="row-start-4 row-end-5 col-start-3 col-end-7 flex items-center justify-center gap-4 lg:w-auto">
    <div className="relative w-[55px] h-[35px] lg:w-[45px] lg:h-[30px]">
      <Image
        src="/images/mastercard.jpg"
        alt="MasterCard"
        fill
        className="object-contain"
      />
    </div>
    <div className="relative w-[55px] h-[35px] lg:w-[45px] lg:h-[30px]">
      <Image
        src="/images/visa.jpg"
        alt="Visa"
        fill
        className="object-contain"
      />
    </div>
  </div>
</div>

  )
}


{/* <div className="border"> */}
                    //   <div className="font-display text-[47px] py-6 uppercase grid place-items-center gap-4 text-center">
                    //   {/* Payment row */}
                    //   <div className="grid grid-cols-[auto_1fr_auto] items-center justify-center gap-4 mix-blend-luminosity">
                    //     <div className="flex justify-center gap-2 text-[32px]">$</div>

                    //     <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                    //       {/* Left payment icons */}
                    //       <div className="flex justify-center items-center gap-4">
                    //         <Image src="/images/discover.jpg" alt="Discover" width={55} height={35} />
                    //         <Image src="/images/amex.jpg" alt="Amex" width={55} height={35} />
                    //       </div>

                    //       {/* Title */}
                    //       <h2 className="text-[36px] sm:text-[42px] md:text-[47px] leading-none">{value.title}</h2>

                    //       {/* Right payment icons */}
                    //       <div className="flex justify-center items-center gap-4">
                    //         <Image src="/images/mastercard.jpg" alt="MasterCard" width={55} height={35} />
                    //         <Image src="/images/visa.jpg" alt="Visa" width={55} height={35} />
                    //       </div>
                    //     </div>

                    //     <div className="flex justify-center gap-2 text-[32px]">$</div>
                        
                    //   </div>
                    // </div>

                    //   <h3 className="font-display bg-white text-black text-[12px] py-[10px] px-16 text-center">
                    //     {value.banner}
                    //   </h3>
                    //   <div className="p-4 text-center [&_ul]:mt-6 text-[20px]">
                    //     <PortableText value={value.rates} components={portableTextComponents} />
                    //   </div>
                    // </div>
