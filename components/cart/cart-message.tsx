"use client"

import { useCartStore } from "@/lib/client-store"
import {motion} from 'framer-motion'
import { DrawerDescription, DrawerTitle } from "../ui/drawer"
import { ArrowLeft } from "lucide-react"

export default function CartMessage() {

  const {setCheckpotProgress, checkoutProgress} = useCartStore()

  return (
    <motion.div animate={{opacity : 1, x : 0}} initial={{opacity : 0, x : 10}} transition={{delay : 0.3}}>
      <DrawerTitle>
        {checkoutProgress === 'cart-page' ? 'Your Cart Items' : 
        null}
        {checkoutProgress === 'confirmation-page' ? 'Order Confirms' : 
        null}
        {checkoutProgress === 'payment-page' ? 'Choose a payment method' : 
        null}
      </DrawerTitle>
      <DrawerDescription className="py-1">
      {checkoutProgress === 'cart-page' ? 'View and edit your cart' : 
      null}
      {checkoutProgress === 'confirmation-page' ? 'Order Confirms' : 
      null}
      {checkoutProgress === 'payment-page' ? <span
      onClick={() => setCheckpotProgress('cart-page')}
      className="flex cursor-pointer items-center justify-center
      hover:text-primary transition-all duration-300">
        <ArrowLeft size={14}/> Head back to cart 
        </span> : 
      null}
      </DrawerDescription>
    </motion.div>
  )
}
