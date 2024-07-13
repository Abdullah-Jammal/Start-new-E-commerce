'use client'

import { VariantsWithImagesTags } from "@/lib/infer-type"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function ProductShowCase({variants} : {variants : VariantsWithImagesTags[]}) {

  const [api, setApi] = useState<CarouselApi>()
  const [activeThumbnail, setActiveThumbnail] = useState([0])

  const searchParams = useSearchParams()
  const selectedColor = searchParams.get('type') || variants[0].productType

  useEffect(() => {
    if(!api) {
      return
    }
    api.on('slidesInView', (e) => {
      setActiveThumbnail(e.slidesInView())
    })
  }, [api])

  const updatePreview = (index : number) => {
    api?.scrollTo(index)
  }

  return (
        <Carousel setApi={setApi} opts={{loop : true}}>
          <CarouselContent>
            {variants.map((variant) => variant.productType === selectedColor && variant.variantImages.map((img, ind) => {
              return (
                <CarouselItem key={ind}>
                  {img.url ? <Image priority className="rounded-md" src={img.url} alt={img.name} width={600} height={320}/> : null}
                </CarouselItem>
              )
            }))}
          </CarouselContent>
          <div className="flex gap-4 my-4 overflow-clip">
          {variants.map((variant) => variant.productType === selectedColor && variant.variantImages.map((img, ind) => {
              return (
                <div key={ind}>
                  {img.url ? <Image priority 
                  onClick={() => updatePreview(ind)}
                  className={cn(ind === activeThumbnail[0] ? 'opacity-100' : 'opacity-65', 'rounded-sm transition-all duration-300 ease-in-out cursor-pointer hover:opacity-65')}
                  src={img.url} alt={img.name} width={72} height={48}/> : null}
                </div>
              )
            }))}
          </div>
        </Carousel>      
  )
}
