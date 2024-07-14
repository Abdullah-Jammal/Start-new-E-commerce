"use client"

import { ReviewsWithUser } from "@/lib/infer-type";
import { Card, CardDescription, CardTitle } from "../ui/card";
import Stars from "./starts";
import { getReviewAverage } from "@/lib/review-average";
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress"


export default function ReviewChart({reviews} : {reviews : ReviewsWithUser[]}) {
  const getRatingByStart = useMemo(() => {
    const ratingValue = Array.from({length : 5}, () => 0)
    const totalReviews = reviews.length
    reviews.forEach((review) => {
      const starIndex = review.rating - 1
      if(starIndex >= 0 && starIndex < 5) {
        ratingValue[starIndex]++
      }
    })
    return ratingValue.map((rating) => (rating / totalReviews) * 100)
  },[reviews])
  const totalRating = getReviewAverage(reviews.map((e) => e.rating))
  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex gap-2 flex-col">
        <CardTitle>
          Product Rating:
        </CardTitle>
        {/* <Stars size={18} rating={totalRating} totalReviews={reviews.length}/> */}
        <CardDescription className="text-md">
          {totalRating.toFixed(1)}
        </CardDescription>
      </div>
      {getRatingByStart.map((rating, index) => (
        <div key={index} className="flex gap-2 justify-between items-center">
          <p className="text-xs flex gap-1 font-medium">{index + 1} <span>stars</span></p>
          <Progress value={rating}/>
        </div>
      ))}
    </Card>
  )
}
