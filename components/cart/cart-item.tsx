"use client"

import { Table, TableBody, TableHead, TableCell, TableRow, TableHeader } from "../ui/table"
import { useCartStore } from "@/lib/client-store"
import formatPrice from "@/lib/format-price"
import { MinusCircle, PlusCircle } from "lucide-react"
import { useMemo } from "react"
import { AnimatePresence, motion } from 'framer-motion'
import Lottie from 'lottie-react'
import emptyCart from '@/public/empty-box.json'
import { createId } from "@paralleldrive/cuid2"

export default function CartItem() {
  const {cart, addToCart, removeFromCart} = useCartStore()
  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity
    }, 0)
  }, [cart])
  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return {letter, id: createId()}
    })
  }, [totalPrice])
  return (
  
    <motion.div>
      {cart.length === 0 && (
        <div className="flex justify-center items-center w-full flex-col">
          <motion.div animate={{opacity : 1, y : 0}} initial={{opacity : 0, y : 30}} transition={{delay : 0.3}}>
            <h2 className="text-2xl text-muted-foreground text-center">Your cart is empty</h2>
            <Lottie className="h-64" animationData={emptyCart}/>
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <MinusCircle onClick={() => {
                        removeFromCart({...item, variant : {
                          quantity: 1,
                          variantID: item.variant.variantID
                        }})
                      }} className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors" size={14}/>
                      <p className="text-md font-bold">{item.variant.quantity}</p>
                      <PlusCircle className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors" size={14} onClick={() => {
                        addToCart({...item, variant: {quantity: 1, variantID: item.variant.variantID,}})
                      }}/>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <motion.div className="flex items-center justify-center my-4 relative overflow-hidden">
        <span className="font-medium">Total: $</span>
        <AnimatePresence mode="popLayout">
          {priceInLetters.map((letter, i) => (
            <motion.div key={i}>
              <motion.span className="inline-block" initial={{y: 20}} animate={{y : 0}} exit={{y : -20}} transition={{delay : i * 0.1}}>
                {letter.letter}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

