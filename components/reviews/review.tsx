'use client'

import { ReviewsWithUser } from "@/lib/infer-type"
import { motion } from "framer-motion"
import { Card } from "../ui/card"
import Image from "next/image"
import {formatDistance, subDays} from 'date-fns'
import Stars from "./starts"

export default function Review({reviews} : {reviews : ReviewsWithUser[]}) {
  return (
    <motion.div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div>
            {/* <Image src={review.user?.image!} width={32} height={32} alt="not found"/> */}
            <p className="font-medium text-sm">{review.user.name}</p>
            <div className="flex gap-2 items-center">
              <Stars rating={review.rating}/>
              <p className="text-xs text-muted-foreground">{formatDistance(subDays(review.create!, 0), new Date())}</p>
            </div>
          </div>
          <p className="text-lg font-medium py-2"><span className="text-muted-foreground">comment</span> : {review.comment}</p>
        </Card>
      ))}
    </motion.div>
  )
}
