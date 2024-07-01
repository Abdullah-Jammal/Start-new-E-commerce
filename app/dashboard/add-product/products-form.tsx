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
  const {status, execute} = useAction(createProduct, {
    onSuccess: (data) => {
      if(data.data?.success) {
        console.log(data.data?.success)
      }
      if(data.data?.error) {
        console.log(data.data?.error)
      }
    }
  })
  const onSubmit = (values : z.infer<typeof ProductsSchema>) => {
    execute(values)
  }

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
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
        <Button disabled={status === 'executing' || !form.formState.isDirty || !form.formState.isValid} type="submit">Create</Button>
      </form>
    </Form>
      </CardContent>
    </Card>
  )
}
