"use server";

import { actionClient } from "@/lib/safe-action";
import { LoginSchema } from "@/types/login-schema";
import { db } from "..";
import { twoFactorTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where : eq(users.email, email)
      })
      if(existingUser?.email !== email) {
        return {error : 'Email not found'}
      }
      if(!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(existingUser.email)
        await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
        return {success : 'Confirmation Email Sent!'}
      }

      if(existingUser.email && existingUser.twoFactorEnabled) {
        if(code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
          if(!twoFactorToken) {
            return {error : 'Invalid Token'}
          }
          if(twoFactorToken.token !== code) {
            return {error : 'Invalid Token'}
          }
          const hasExpires = new Date(twoFactorToken.expires) < new Date()
          if(hasExpires) {
            return {error : 'Token has expired'}
          }
          await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id))
        } else {
          const token = await generateTwoFactorToken(existingUser.email)
          if(!token) {
            return {error : 'There is no token'}
          }
          await sendTwoFactorTokenByEmail(token[0].email, token[0].token)
          return {twoFactor : 'Two Factor Token Sent!'}
        }
      }

      await signIn('credentials', {
        email,
        password,
        redirectTo: '/'
      })
      return {success : email}
    }
    catch(error) {
      if(error instanceof AuthError) {
        switch(error.type) {
          case 'AccessDenied' :
            return {error : error.message}
          case 'OAuthSignInError' :
            return {error : error.message}
          default : return {error : 'Something went wrong!'}
        }
      }
      throw error
    }
  });

