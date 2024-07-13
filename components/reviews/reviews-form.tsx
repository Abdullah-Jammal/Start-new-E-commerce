'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { reviewSchema } from "@/types/reviews-schema"

import {motion} from 'framer-motion'
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { addReview } from "@/server/actions/add-review"
import { toast } from "sonner"

export default function ReviewForm() {
  const param = useSearchParams()
  const productID = Number(param.get('productID'))

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema), 
    defaultValues : {
      rating : 0,
      comment : '',
      productID,
    }
  })
  const {execute, status} = useAction(addReview, {
    onSuccess(data) {
      if(data.data?.error) {
        toast.error(data.data?.error)
      }
      if(data.data?.success) {
        toast.success('Review Added')
        form.reset()
      }
    }
  })
  const onSubmit = (values: z.infer<typeof reviewSchema>) => {
    execute({
      comment : values.comment,
      productID,
      rating : values.rating
    })
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="font-medium w-full" variant={'secondary'}>Leave a review</Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leave your review</FormLabel>
                <FormControl>
                  <Textarea placeholder="leave your review" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leave your rating</FormLabel>
                <FormControl>
                  <Input type="hidden" placeholder="Star rating" {...field}/>
                </FormControl>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value, ind) => {
                    return (
                      <motion.div className="relative cursor-pointer" whileTap={{scale: 0.8}} whileHover={{scale : 1.2}} key={ind}>
                        <Star key={ind} onClick={() => {
                          form.setValue('rating', value, {
                            shouldValidate : true
                          })
                        }} className={cn('text-primary bg-transparent transition-all duration-300 ease-in-out', form.getValues('rating') >= value ? 'fill-primary' : 'fill-muted')}/>
                      </motion.div>
                    )
                  })}
                </div>
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={status === 'executing'} type="submit">
            {status === 'executing' ? 'Adding Review...' : 'Add Review'}
          </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
