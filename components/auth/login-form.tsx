"use client"

import { useForm } from "react-hook-form";
import { AuthCard } from "./auth-card";
import {zodResolver} from '@hookform/resolvers/zod'
import { LoginSchema } from "@/types/login-schema";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import Link from "next/link";
import { emailSignIn } from "@/server/actions/email-signin";
import { useAction } from 'next-safe-action/hooks'
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"


export const LoginForm = () => {

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues : {
      email : '',
      password : '',
    }
  })

  const {execute, status} = useAction(emailSignIn, {
    onSuccess(data) {
      if(data.data?.error) setError(data.data.error)
      if(data.data?.success) return setSuccess(data.data.success)
      if(data.data?.twoFactor) {
        setShowTwoFactor(true)
      }
    }
  })

  const onSubmit = (values : z.infer<typeof LoginSchema>) => {
    execute(values)
  }
  return (
    <AuthCard CardTitles="Welcome Back!" showSocials backButtoHref="/auth/register" backButtonLabel="Create a new account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({field}) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    We have sent you two factor code to your email 
                  </FormLabel>
                  <FormControl>
                    <InputOTP disabled={status === 'executing'} {...field} maxLength={6} >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Email */}
          {!showTwoFactor && (
          <>
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Email
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="email@gmail.com" type="email"/>
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Password
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="***********" type="password"/>
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          </>
          )}
          <FormSuccess message={success}/>
          <FormError message={error}/>
          <div className="flex flex-col w-60">
            <Button className={cn('my-4 font-bold', status === 'executing' ? 'animate-pulse' : '')} type="submit">
              {showTwoFactor ? 'verify' : 'Sign in'}
            </Button>
            <Button variant={"link"}>
              <Link href={'/auth/reset'}>Forget Password</Link>
            </Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};
