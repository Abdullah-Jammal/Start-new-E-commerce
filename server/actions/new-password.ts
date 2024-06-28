"use server"

import { actionClient } from "@/lib/safe-action"
import { NewPasswordSchema } from "@/types/new-password-schema"
import { getPasswordResetTokenByToken } from "./tokens"
import { db } from ".."
import { eq } from "drizzle-orm"
import bcrypt from 'bcrypt'
import { passwordResetTokens, users } from "../schema"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

export const newPassword = actionClient.schema(NewPasswordSchema).action(async ({parsedInput: {password, token}}) => {
  const pool = new Pool({connectionString : process.env.POSTGRES_URL})
  const dbPool = drizzle(pool)
  if(!token) {
    return {error : 'Missing Token'}
  }
  // Check if the token is valid
  const existingToken = await getPasswordResetTokenByToken(token)
  if(!existingToken) {
    return {error : 'Token Not Found'}
  }
  const hasExpired = new Date(existingToken.expires) < new Date()
  if(hasExpired) {
    return {error : 'Token has Expire'}
  }
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email)
  })
  if(!existingUser) {
    return {error : 'User not found'}
  }
  const hashedPassowrd = await bcrypt.hash(password, 10)

  await dbPool.transaction(async (tx) => {
    await tx.update(users).set({
      password : hashedPassowrd,
    }).where(eq(users.id, existingUser.id))
    tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
  })
  return {success : 'password update'}
}) 
