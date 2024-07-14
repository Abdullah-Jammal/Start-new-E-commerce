"use client"

import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth } from "@/server/auth"


export default function UserButton({user} : Session) {
  const router = useRouter()
  const {setTheme, theme} = useTheme()
  const [check, setCheck] = useState(false)

  function setSwitchState() {
    switch(theme) {
      case 'dark' : setCheck(true)
      case 'light' : setCheck(false)
      case 'system' : setCheck(false)
    }
  }

  if(user)
  return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar className="w-7 h-7">
            {user.image && (
                <Image src={user.image} alt={user.name!} priority={true} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
            )}
            {!user.image && (
              <AvatarFallback className="bg-primary flex justify-center items-center w-full text-white">
                <div className="font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-4 py-6 mr-2">
          <DropdownMenuLabel className="p-3 mb-4 rounded-md">{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={() => router.push('/dashboard/orders')} className="py-2 font-medium group cursor-pointer">
            <TruckIcon size={16} className="mr-3 group-hover:translate-x-1 transition duration-300"/>My orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="py-2 font-medium group cursor-pointer"><Settings size={14} className="mr-3 group-hover:rotate-180 transition duration-500 ease-in-out"/>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 font-medium cursor-pointer">
            <div  onClick={(e) => e.stopPropagation()} className="flex justify-center items-center group">
              <div className=" flex items-center justify-center">
                <Sun size={14} className="mr-3 group-hover:rotate-180 absolute dark:scale-0 group-hover:text-yellow-400 transition-all duration-500 ease-in-out"/>
                <Moon size={14} className="mr-3 group-hover:rotate-180 dark:scale-100 scale-0 group-hover:text-blue-400 transition-all duration-500 ease-in-out"/>
              </div>
              <p className="dark:text-blue-400 font-bold">{theme}</p>
              <Switch className="scale-75 ml-1" checked={check} onCheckedChange={(e) => {
                setCheck(pre => !pre)
                if(e) setTheme('dark')
                if(!e) setTheme('light')
              }}/>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="py-2 bg-destructive flex items-center justify-center mt-3 font-bold hover:opacity-80 focus:bg-destructive transition duration-300 cursor-pointer">
            <LogOut size={14} className="mr-3"/>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
