'use client'

import { VariantsWithProduct } from "@/lib/infer-type"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "../ui/badge"
import formatPrice from "@/lib/format-price"

export default function Products({variants} : {variants : VariantsWithProduct[]}) {
  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 container mx-auto gap-4">
      {variants.map((variant, ind) => (
        <Link className="py-4" key={ind} href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}
        &title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}>
          <Image className="rounded-sm" src={variant.variantImages[0].url} alt={variant.product.title} width={520} height={480} loading="lazy"/>
          <div className="flex justify-between items-center">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
              <p className="text-muted-foreground text-sm">{variant.productType}</p>
            </div>
            <div>
              <Badge className="text-sm" variant={'secondary'}> 
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  )
}
