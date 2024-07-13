"use server"

import { actionClient } from "@/lib/safe-action"
import { db } from ".."
import { productVariant } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import algoliasearch from "algoliasearch"

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_ID!, process.env.ALGOLIA_ADMIN!)

const algoliaIndex = client.initIndex('products')


export const deleteVariant = actionClient.schema(z.object({id : z.number()})).action(async ({parsedInput: {id}}) => {
  try{
    const deletedVariants = await db.delete(productVariant).where(eq(productVariant.id, id)).returning()
    revalidatePath('/dashboard/products')
    algoliaIndex.deleteObject(deletedVariants[0].id.toString())
    return {success : `Deleted ${deletedVariants[0].productType}`}
  }
  catch(error) {
    return {error : 'Faild to delete'}
  }
})

