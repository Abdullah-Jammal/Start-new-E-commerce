"use server"

import { actionClient } from "@/lib/safe-action";
import { ProductsSchema } from "@/types/products-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products } from "../schema";
import { revalidatePath } from "next/cache";

export const createProduct = actionClient.schema(ProductsSchema).action(async ({ parsedInput: { title, description, price, id } }) => {
  try{
    if(id) {
      const currentProduct = await db.query.products.findFirst({
        where : eq(products.id, id)
      })
      if(!currentProduct) return {error : 'Product Not Found'}
      const editedProduct = await db.update(products).set({title, description, price}).where(eq(products.id, id)).returning()
      revalidatePath('/dashboard/products')
      return {success : `Product ${editedProduct[0].title} has been updated`}
    }
    if(!id) {
      const newProduct = await db.insert(products).values({title, description, price}).returning()
      return {success : `Product ${newProduct[0].title} has beed added`}
    }
  }
  catch(error) {
    return {error: JSON.stringify(error)}
  }
})

