"use server";

import { actionClient } from "@/lib/safe-action";
import { LoginSchema } from "@/types/login-schema";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const existingUser = await db.query.users.findFirst({
      where : eq(users.email, email)
    })
    if(existingUser?.email !== email) {
      return {error : 'Email not found'}
    }
    return {success : email}
  });
