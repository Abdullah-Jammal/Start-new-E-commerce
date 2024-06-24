import z from 'zod'


export const RegisterSchema = z.object(
  {
    email : z.string().email(),
    password : z.string().min(8, {
      message : 'You must have at least 8 character'
    }),
    name : z.string().min(4, {message : 'Must have more than 3 characters'})
  }
)
