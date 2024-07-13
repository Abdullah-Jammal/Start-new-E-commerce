"use server"

import { actionClient } from "@/lib/safe-action"
import { VariantSchema } from "@/types/variant-schema"
import { db } from ".."
import { products, productVariant, variantImages, variantTags } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import algoliasearch from 'algoliasearch'


const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_ID!, process.env.ALGOLIA_ADMIN!)

const algoliaIndex = client.initIndex('products')

export const createVariant = actionClient.schema(VariantSchema).action(async ({parsedInput : {color, editMode, id, productID, productType, variantImages: newImages, tags}}) => {
  try {
    if(editMode && id) {
      const editVariant = await db.update(productVariant).set({
        color, productType, updated: new Date()
      }).where(eq(productVariant.id, id))
      .returning()

      await db.delete(variantTags).where(eq(variantTags.id, editVariant[0].id))

      await db.insert(variantTags).values(
        tags.map((tag: any) => ({
          tag,
          variantID: editVariant[0].id,
        }))
      )

      await db.delete(variantImages).where(eq(variantImages.variantID, editVariant[0].id))

      await db.insert(variantImages).values(
        newImages.map((img: { name: string; size: number; url: string }, idx: number) => ({
          name: img.name,
          size: img.size,
          url: img.url,
          variantID: editVariant[0].id,
          order: idx,
        }))
      )
      algoliaIndex.partialUpdateObject({
        objectID : editVariant[0].id.toString(),
        id : editVariant[0].id,
        productType : editVariant[0].productType,
        variantImages : newImages[0].url,
      })
      revalidatePath('/dashboard/products')
      return {success : `Edited ${productType}`}
    }

    if(!editMode) {
      const newVariant = await db.insert(productVariant).values({
        color,
        productType,
        productID
      }).returning()

      const product = await db.query.products.findFirst({
        where: eq(products.id, productID)
      })

      await db.insert(variantTags).values(
        tags.map((tag: any) => ({
          tag,
          variantID: newVariant[0].id,
        }))
      )

      await db.insert(variantImages).values(
        newImages.map((img: { name: string; size: number; url: string }, idx: number) => ({
          name: img.name,
          size: img.size,
          url: img.url,
          variantID: newVariant[0].id,
          order: idx,
        }))
      )

      if(product) {
        algoliaIndex.saveObject({
          objectID : newVariant[0].id.toString(),
          id : newVariant[0].id,
          title : product.title,
          price : product.price,
          productType : newVariant[0].productType,
          variantImages : newImages[0].url,
        })
    }
      revalidatePath('/dashboard/products')
      return {success : `Added ${productType}`}
    }
  }

  catch(error) {
    return {error : 'Failed to create'}
  }
})
