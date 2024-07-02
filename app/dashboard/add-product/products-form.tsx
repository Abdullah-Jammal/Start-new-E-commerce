"use client"

import { ProductsSchema } from "@/types/products-schema"
import { useForm } from "react-hook-form"
import z from 'zod'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { DollarSign } from "lucide-react"
import Tiptap from './tiptap'
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { createProduct } from "@/server/actions/create-product"
import { useRouter, useSearchParams } from "next/navigation"
import {toast} from 'sonner'
import { getProduct } from "@/server/actions/get-product"
import { useEffect } from "react"

export default function CreateProduct() {
  const form = useForm<z.infer<typeof ProductsSchema>>({
    resolver : zodResolver(ProductsSchema),
    defaultValues: {
      price: 0,
      title : '',
      description : ''
    },
    mode: 'onChange'
  })

  const rout = useRouter()
  const searchParams = useSearchParams()
  const editMode = searchParams.get('id')

  const checkProduct = async (id: number) => {
    if(editMode) {
      const data = await getProduct(id)
      if(data.error) {
        toast.error(data.error)
        rout.push('/dashboard/products')
        return
      }
      if(data.success) {
        const id = parseInt(editMode)
        form.setValue('title', data.success.title)
        form.setValue('description', data.success.description)
        form.setValue('price', data.success.price)
        form.setValue('id', data.success.id)
      }
    }
  }

  useEffect(() => {
    if(editMode) {
      checkProduct(parseInt(editMode))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const {status, execute} = useAction(createProduct, {
    onSuccess: (data) => {
      if(data.data?.success) {
        console.log(data.data?.success)
        rout.push('/dashboard/products')
        toast.success('Creating the product')
      }
      if(data.data?.error) {
        console.log(data.data?.error)
        toast.error('Faild to create product')
      }
    },
    onExecute: () => {
      if(!editMode) {
        toast.loading('creating the prodcut')
      }
      if(editMode) {
        toast.loading('Updating the product')
      }
    }
  })
  const onSubmit = (values : z.infer<typeof ProductsSchema>) => {
    execute(values)
  }

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle>{editMode ? 'Edit Product' : 'Create Product'}</CardTitle>
      </CardHeader>
      <CardContent>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input placeholder="Saekdong Stripe" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Tiptap val={field.value}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Price</FormLabel>
              <FormControl>
                <div className="flex items-center gap-1">
                <DollarSign size={34} className="p-2 bg-muted rounded-md"/>
                <Input {...field} type="number" placeholder="Your Price in USD" step='0.1' min={0}/>
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button disabled={status === 'executing' || !form.formState.isDirty || !form.formState.isValid} type="submit">
          {editMode ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </Form>
      </CardContent>
    </Card>
  )
}
