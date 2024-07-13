
import z from 'zod'

export const reviewSchema = z.object({
  productID : z.number(),
  rating : z.number().min(1, {message : 'must be more than one'}).max(5, {message : 'can not be more than 5'}),
  comment : z.string().min(10, {message : 'please at least 10 charc for this review'})
})
