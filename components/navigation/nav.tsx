import {auth} from '@/server/auth'
import Logo from './logo'
import UserButton from './user-button'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { LogIn } from 'lucide-react'

export default async function Nav() {
  const session = await auth()
  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="logo">
            <Logo/>
          </div>
          <nav>
            <ul>
              {!session ? (
                <li>
                  <Button>
                    <Link className='flex items-center justify-center gap-4' href={'/auth/login'}>
                      <LogIn size={14}/><span>LogIn</span>
                    </Link>
                  </Button>
                </li>
              ): 
              <li>
                <UserButton expires={session?.expires} user={session?.user}/>
              </li>
              }
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

