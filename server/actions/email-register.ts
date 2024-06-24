"use server";

import { actionClient } from "@/lib/safe-action";
import { RegisterSchema } from "@/types/register-schema";
import bcrypt from 'bcrypt'
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";

export const emailRegister = actionClient.schema(RegisterSchema).action(async ({ parsedInput: { email, password, name } }) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await db.query.users.findFirst({
    where : eq(users.email, email)
  })
  if(existingUser) {
    if(!existingUser.emailVerified) {
      const emailVerification = await generateEmailVerificationToken(email);
      // await sendVerificationEmail()
      return {success : 'Email Confirmation resent'}
    }
    return {error : 'Email Aleady Exist!'}
  }
  await db.insert(users).values({
    name,
    email,
    password : hashedPassword
  })
  const verificationToken = await generateEmailVerificationToken(email)
  // await sendVerificationEmail()
  return {success : 'Confirmation Email Sent!'}
})
