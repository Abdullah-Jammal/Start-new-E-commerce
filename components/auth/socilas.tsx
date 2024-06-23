"use client"

import { signIn } from "next-auth/react";
import { Button } from "../ui/button"
import { FaGoogle, FaGithub } from "react-icons/fa";


export default function Socials() {
  return (
    <div className="flex gap-6 flex-col w-full">
      <Button className="font-bold" onClick={() => signIn('google', {redirect: false, callbackUrl: '/'})}>
        Sign in with Google <FaGoogle className="ml-8"/>
      </Button>
      <Button className="font-bold" onClick={() => signIn('github', {redirect : false, callbackUrl: '/'})}>
        Sign in with Github <FaGithub  className="ml-8"/>
      </Button>
    </div>
  )
}
