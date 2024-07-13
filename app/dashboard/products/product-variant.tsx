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
import { useAction } from "next-safe-action/hooks"
import { createVariant } from "@/server/actions/create-variant"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { deleteVariant } from "@/server/actions/delete-variant"


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

    const [open, setOpen] = useState(false)

    const setEdit = () => {
      if(!editMode) {
        form.reset()
        return
      }
      if(editMode && variant) {
        form.setValue('editMode', true)
        form.setValue('id', variant.id)
        form.setValue('productID', variant.productID)
        form.setValue('productType', variant.productType)
        form.setValue('color', variant.color)
        form.setValue('tags', variant.variantTags.map(tag => tag.tag))
        form.setValue('variantImages', variant.variantImages.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.url,
          id: 0
        })))
      }
    }

    useEffect(() => {
      setEdit()
    }, [])

    const {execute, status} = useAction(createVariant,{
      onExecute() {
        toast.loading('creating variant', {duration : 500})
        setOpen(false)
      },
      onSuccess(data) {
        if(data.data?.success) {
          toast.success('Variant Created')
        }
        if(data.data?.error) {
          toast.error('Failed create variant')
        }
      }
    })

    const variantAction = useAction(deleteVariant, {
      onExecute() {
        toast.loading('Deleting variant', {duration : 500})
        setOpen(false)
      },
      onSuccess(data) {
        if(data.data?.error) {
          toast.error(data.data.error)
        }
        if(data.data?.success) {
          toast.success(data.data?.success, {duration : 500})
        }
      }
    })

    function onSubmit(values: z.infer<typeof VariantSchema>) {
      execute(values)
    }

  return (
      <Dialog open={open} onOpenChange={setOpen}>
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
        <div className="gap-4 flex">
          {editMode && variant && (
            <Button variant={'destructive'} disabled={variantAction.status === 'executing'} className="" type="button" onClick={(e) => {
              e.preventDefault()
              variantAction.execute({id : variant.id})
            }}>Delete variant</Button>
          )}
          <Button disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty} type="submit">{editMode ? 'Update variant' : 'Create variant'}</Button>
        </div>
      </form>
    </Form>
        </DialogContent>
      </Dialog>
  )
}
