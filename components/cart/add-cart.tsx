"use client"

import { useCartStore } from "@/lib/client-store"
import { useState } from "react"
import { Button } from "../ui/button"
import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

export default function AddCart() {

  const {addToCart} = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const params = useSearchParams()
  const id = Number(params.get('id'))
  const productID = Number(params.get('productID'))
  const title = params.get('title')
  const type = params.get('type')
  const price = Number(params.get('price'))
  const image = params.get('image')

  return (
    <>
      <div className="flex justify-stretch items-center gap-2 my-4">
        <Button variant={'secondary'} className="text-primary" onClick={() => {
          if(quantity > 1) {
            setQuantity(quantity - 1)
          }
        }}>
          <Minus size={18} strokeWidth={3}/>
        </Button>
        <Button className="flex-1">Quantity : {quantity}</Button>
        <Button variant={'secondary'} className="text-primary"
        onClick={() => {
          setQuantity(quantity + 1)
        }}
        >
          <Plus size={18} strokeWidth={3}/>
        </Button>
      </div>
      <Button onClick={() => {
        toast.success(`Added ${title + ' ' + type} to your cart`)
        addToCart({id: productID, variant: {variantID : id, quantity}, name: title + ' ' + type, price, image})
      }}>
        Add to cart
      </Button>
    </>
  )
}
