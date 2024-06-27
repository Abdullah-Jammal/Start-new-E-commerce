"use client"

import { useForm } from "react-hook-form";
import { AuthCard } from "./auth-card";
import {zodResolver} from '@hookform/resolvers/zod'
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { useAction } from 'next-safe-action/hooks'
import { cn } from "@/lib/utils";
import { useState } from "react";
import { newPassword } from "@/server/actions/new-password";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { useSearchParams } from "next/navigation";

export const NewPassowrdForm = () => {

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues : {
      password : ''
    }
  })

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const {execute, status} = useAction(newPassword, {
    onSuccess(data) {
      if(data.data?.error) setError(data.data.error)
      if(data.data?.success) return setSuccess(data.data.success)
    }
  })

  const onSubmit = (values : z.infer<typeof NewPasswordSchema>) => {
    execute({password : values.password, token})
  }
  return (
    <AuthCard CardTitles="Enter a new password" showSocials backButtoHref="/auth/login" backButtonLabel="Back to login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <Input {...field} placeholder="***********" type="password" disabled={status === 'executing'}/>
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



// "use client"

// import { useForm } from "react-hook-form"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { AuthCard } from "./auth-card"
// import * as z from "zod"
// import { Input } from "../ui/input"
// import { Button } from "../ui/button"
// import Link from "next/link"
// import { useAction } from "next-safe-action/hooks"
// import { cn } from "@/lib/utils"
// import { useState } from "react"
// import { FormSuccess } from "./form-success"
// import { FormError } from "./form-error"
// import { NewPasswordSchema } from "@/types/new-password-schema"
// import { newPassword } from "@/server/actions/new-password"
// import { useSearchParams } from "next/navigation"

// export const NewPasswordForm = () => {
//   const form = useForm<z.infer<typeof NewPasswordSchema>>({
//     resolver: zodResolver(NewPasswordSchema),
//     defaultValues: {
//       password: "",
//     },
//   })

//   const searchParams = useSearchParams()
//   const token = searchParams.get("token")

//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")

//   const { execute, status } = useAction(newPassword, {
//     onSuccess(data) {
//       if (data.data?.error) setError(data?.data.error)
//       if (data.data?.success) {
//         setSuccess(data.data?.success)
//       }
//     },
//   })

//   const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
//     execute({ password: values.password, token })
//   }

//   return (
//     <AuthCard
//     CardTitles="Enter a new password"
//     backButtoHref="/auth/login"
//       backButtonLabel="Back to login"
//       showSocials
//     >
//       <div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             <div>
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="*********"
//                         type="password"
//                         autoComplete="current-password"
//                         disabled={status === "executing"}
//                       />
//                     </FormControl>
//                     <FormDescription />
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormSuccess message={success} />
//               <FormError message={error} />
//               <Button size={"sm"} variant={"link"} asChild>
//                 <Link href="/auth/reset">Forgot your password</Link>
//               </Button>
//             </div>
//             <Button
//               type="submit"
//               className={cn(
//                 "w-full",
//                 status === "executing" ? "animate-pulse" : ""
//               )}
//             >
//               Reset Password
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </AuthCard>
//   )
// }