import {Stripe, loadStripe} from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

const getStrip = () => {
  if(!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISH_KEY!)
  }
  return stripePromise
}

export default getStrip
