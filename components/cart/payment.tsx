"use client"

import { useCartStore } from '@/lib/client-store'
import getStrip from '@/lib/get-stripe'
import {Elements} from '@stripe/react-stripe-js' 
import { motion } from 'framer-motion'
import PaymentForm from './payment-form'

const strip = getStrip()

export default function Payment() {
  const {cart} = useCartStore()
  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.variant.quantity
  }, 0)
  return (
    <motion.div>
      <Elements stripe={strip} options={{
        mode: 'payment',
        currency : 'usd',
        amount: totalPrice,
      }}>
        <PaymentForm totalPrice = {totalPrice}/>
      </Elements>
    </motion.div>
  )
}
