import z from 'zod'

export const ProductsSchema = z.object({
  id: z.number().optional(),
  title : z.string().min(5, {
    message : 'Title must be at least 5 charactors'
  }),
  description : z.string().min(40, {
    message : 'Must be at least 40 charators'
  }),
  price : z.coerce.number({invalid_type_error : 'Price must be a number'}).positive({
    message : 'must be positive'
  })
})
