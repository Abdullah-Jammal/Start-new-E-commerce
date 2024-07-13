'use server'

import { actionClient } from "@/lib/safe-action"
import { reviewSchema } from "@/types/reviews-schema"
import { auth } from "../auth"
import { db } from ".."
import { and, eq } from "drizzle-orm"
import { reviews } from "../schema"
import { revalidatePath } from "next/cache"


export const addReview = actionClient.schema(reviewSchema).action( async ({parsedInput : {productID, rating, comment}}) => {
  try{
    const session = await auth()
    if(!session) return {error : 'please sign in'}
    const reviewExist = await db.query.reviews.findFirst({
      where : and(eq(reviews.productID, productID), eq(reviews.userID, session.user.id))
    })
    if(reviewExist) {
      return {error : 'You already reviewed this product'}
    }
    const newReview = await db.insert(reviews).values({
      productID,
      rating,
      comment,
      userID : session.user.id
    }).returning()
    revalidatePath(`/product/${productID}`)
    return {success : newReview[0]}
  }
  catch(error) {
    return {error : JSON.stringify(error)}
  }
})
