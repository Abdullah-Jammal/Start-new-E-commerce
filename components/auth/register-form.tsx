"use client"

import { useForm } from "react-hook-form";
import { AuthCard } from "./auth-card";
import {zodResolver} from '@hookform/resolvers/zod'
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { emailRegister } from "@/server/actions/email-register";
import { useAction } from 'next-safe-action/hooks'
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RegisterSchema } from "@/types/register-schema";

export const RegisterForm = () => {

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues : {
      email : '',
      password : '',
      name : ''
    }
  })

  const {execute, status, result} = useAction(emailRegister, {
    onSuccess(data) {
      if(data.data?.success) {
        console.log(data.data?.success)
      }
    }
  })

  const onSubmit = (values : z.infer<typeof RegisterSchema>) => {
    execute(values)
    console.log(values)
  }
  return (
    <AuthCard CardTitles="Register Now" showSocials backButtoHref="/auth/login" backButtonLabel="Already have an account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  User Name
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="your name" type="text"/>
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email */}
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
          <div className="flex flex-col w-60">
            <Button className={cn('my-4 font-bold', status === 'executing' ? 'animate-pulse' : '')} type="submit">
              Register
            </Button>
            {/* <Button variant={"link"}>
              <Link href={'/auth/reset'}>Forget Password</Link>
            </Button> */}
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};
