
import NextAuth from "next-auth"
// import { DrizzleAdapter } from "@auth/drizzle-adapter"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Credentials from 'next-auth/providers/credentials'
import { LoginSchema } from "@/types/login-schema"
import { db } from "."
import { eq } from "drizzle-orm"
import { users } from "./schema"
import bcrypt from 'bcrypt'

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET!,
  session : {strategy : 'jwt'},
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      authorize : async (credentials) => {
        const validateFields = LoginSchema.safeParse(credentials)
        if(validateFields.success) {
          const {email, password} = validateFields.data
          const user = await db.query.users.findFirst({
            where: eq(users.email, email)
          })
          if(!user || !user.password) return null
          const passwordMatch = await bcrypt.compare(password, user.password)
          if(passwordMatch) return user
        }
        return null
      }
    })
  ],
})
