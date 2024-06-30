"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Session } from "next-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SettingsSchema } from "@/types/settings-schema"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { settings } from "@/server/actions/settings"

type SettingsForm = {
  session : Session
}

export default function SettingsCard(session : SettingsForm) {

  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [avatarUploading, setAvatarUploading] = useState(false)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.session.user?.name || undefined,
      image: session.session.user.image || undefined,
      isTwoFactorEnabled : session.session.user?.isTwoFactorEnabled || false,
      email : session.session.user?.email || undefined,
      password: undefined,
      newPassword: undefined
    },
  })

  const {execute, status} = useAction(settings, {
    onSuccess: (data) => {
      if(data.data?.success) {
        setSuccess(data.data.success)
      }
      if(data.data?.error) {
        setError(data.data?.error)
      }
    }
  })

  function onSubmit(values: z.infer<typeof SettingsSchema>) {
    console.log(values)
    execute(values)
  }

  return (
    <div className="container mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Your Settings</CardTitle>
          <CardDescription>Update your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <div className="flex">
                      {!form.getValues('image') && (
                        <div className="font-medium bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                          {session.session.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {form.getValues('image') && (
                        <Image src={form.getValues('image')!} width={50} height={50} alt={form.getValues('name')!}/>
                      )}
                    </div>
                    <FormControl>
                      <Input placeholder="user image" type="hidden" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Password</FormLabel>
                    <FormControl>
                      <Input placeholder="********" {...field} disabled={status === 'executing' || session.session.user.isOAuth === true}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input placeholder="********" {...field} disabled={status === 'executing' || session.session.user.isOAuth === true}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormControl>
                      <Switch className="scale-100" disabled={status === 'executing' || session.session.user.isOAuth === true}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error}/>
              <FormSuccess message={success}/>
              <Button type="submit" disabled={status === 'executing' || avatarUploading}>Update Your Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
