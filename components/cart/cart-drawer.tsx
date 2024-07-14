'use client'

import { useCartStore } from "@/lib/client-store"
import { ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {motion, AnimatePresence} from 'framer-motion'
import CartItem from "./cart-item";
import CartMessage from "./cart-message";


export default function CartDrawer() {
  const {cart, checkoutProgress} = useCartStore();
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span animate={{scale: 1, opacity: 1}} initial={{opacity: 0, scale : 0}} exit={{scale: 0}}
              className="absolute flex items-center justify-center -top-0.5 right-0 w-4 h-4 dark:bg-primary
              bg-primary/50 text-xs font-bold rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag/>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <CartMessage/>
        </DrawerHeader>
        {checkoutProgress === 'cart-page' && <CartItem/>}
      </DrawerContent>
    </Drawer>
  )
}
