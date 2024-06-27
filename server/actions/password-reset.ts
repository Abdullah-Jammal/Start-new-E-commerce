"use server"

import { actionClient } from "@/lib/safe-action"
import { resetSchema } from "@/types/reset-schema"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "../schema"
import {generatePasswordResetToken} from '@/server/actions/tokens'
import { sendPasswordResetEmail } from "./email"

export const passwordReset = actionClient.schema(resetSchema).action(async ({parsedInput: {email}}) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email)
  })
  if(!existingUser) {
    return {error : 'User not found!'}
  }
  const passwordResetToken = await generatePasswordResetToken(email)
  if(!passwordResetToken) {
    return {error : 'Token not generated'}
  }
  await sendPasswordResetEmail(passwordResetToken[0].email, passwordResetToken[0].token)
  return {success : 'Reset Passowrd Sent'}
})
