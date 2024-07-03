"use client"

import { VariantsWithImagesTags } from "@/lib/infer-type"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { VariantSchema } from "@/types/variant-schema"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {InputTags} from "./input-tags"
import VariantImages from "./variant-images"


export const ProductVariant = ({editMode, productID, variant, children} : {
  editMode: boolean, productID?: number, variant?: VariantsWithImagesTags, children: React.ReactNode}) => {
    const form = useForm<z.infer<typeof VariantSchema>>({
      resolver : zodResolver(VariantSchema),
      defaultValues: {
        tags: [],
        color: '#000000',
        variantImages: [],
        editMode,
        id: undefined,
        productID,
        productType: 'Black notebook'
      },
    })

    function onSubmit(values: z.infer<typeof VariantSchema>) {
      console.log(values)
    }

  return (
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px]">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit' : 'Create'} your variant</DialogTitle>
            <DialogDescription>
              Manage your product here. You can add tags, images, and more.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant title</FormLabel>
              <FormControl>
                <Input placeholder="Pick a title for your variant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Color */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant Tags</FormLabel>
              <FormControl>
                <InputTags {...field} onChange={(e) => field.onChange(e)}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <VariantImages/>
        {editMode && variant && (
          <Button className="" type="button" onClick={(e) => e.preventDefault()}>Delete variant</Button>
        )}
        <Button type="submit">{editMode ? 'Update variant' : 'Create variant'}</Button>
      </form>
    </Form>
        </DialogContent>
      </Dialog>
  )
}
