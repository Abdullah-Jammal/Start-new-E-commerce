"use client"

import { useForm } from "react-hook-form";
import { AuthCard } from "./auth-card";
import {zodResolver} from '@hookform/resolvers/zod'
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import Link from "next/link";
import { useAction } from 'next-safe-action/hooks'
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { resetSchema } from "@/types/reset-schema";
import { passwordReset } from "@/server/actions/password-reset";

export const ResetForm = () => {

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues : {
      email : ''
    }
  })

  const {execute, status} = useAction(passwordReset, {
    onSuccess(data) {
      if(data.data?.error) setError(data.data.error)
      if(data.data?.success) return setSuccess(data.data.success)
    }
  })

  const onSubmit = (values : z.infer<typeof resetSchema>) => {
    execute(values)
  }
  return (
    <AuthCard CardTitles="Forgot your password" showSocials backButtoHref="/auth/login" backButtonLabel="Back to login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Email
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="email@gmail.com" type="email" disabled={status === 'executing'}/>
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSuccess message={success}/>
          <FormError message={error}/>
          <div className="flex flex-col w-60">
            <Button className={cn('my-4 font-bold', status === 'executing' ? 'animate-pulse' : '')} type="submit">
              Reset Passowrd
            </Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};

