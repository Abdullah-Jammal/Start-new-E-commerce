
import NextAuth from "next-auth"
// import { DrizzleAdapter } from "@auth/drizzle-adapter"
// import { db } from "."
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"

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
    })
  ],
})