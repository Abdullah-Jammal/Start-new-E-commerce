import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export type Variant = {
  variantID : number,
  quantity: number
}

export type CartItem = {
  name : string,
  image : string,
  id: number,
  variant : Variant,
  price : number
}

export type CartState = {
  cart : CartItem[]
  checkoutProgress: 'cart-page' | 'payment-page' | 'confirmation-page'
  setCheckpotProgress: (val : 'cart-page' | 'payment-page' | 'confirmation-page') => void
  addToCart: (item : CartItem) => void
  removeFromCart : (item : CartItem) => void
}

export const useCartStore = create<CartState>()(
  persist(
  (set) => ({
  cart: [],
  checkoutProgress: 'cart-page',
  setCheckpotProgress: (val) => set((state) => (
    {checkoutProgress: val}
  )),
  addToCart : (item) => set((state) => {
    const existingItem = state.cart.find((cartItem) => cartItem.variant.variantID === item.variant.variantID);
    if(existingItem) {
      const updatedCart = state.cart.map((cartItem) => {
        if(cartItem.variant.variantID === item.variant.variantID) {
          return {...cartItem, variant : {
            ...cartItem.variant,
            quantity : cartItem.variant.quantity + item.variant.quantity
          }}
        }
        return cartItem
      })
      return {cart: updatedCart}
    } else {
      return {cart: [...state.cart, {...item, variant: {variantID : item.variant.variantID, quantity : item.variant.quantity}}]}
    }
  }),
  removeFromCart: (item) => set((state) => {
    const updateCart = state.cart.map((cartItem) => {
      if(cartItem.variant.variantID === item.variant.variantID) {
        return {...cartItem, variant: {...cartItem.variant, quantity : cartItem.variant.quantity - 1}}
      }
      return cartItem
    })
    return {cart : updateCart.filter((item) => item.variant.quantity > 0 )}
  })
}), {name : 'cart-storage'} 
  )
)
