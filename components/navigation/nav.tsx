import {auth} from '@/server/auth'
import Logo from './logo'
import UserButton from './user-button'
import { Button } from "@/components/ui/button"
import { LogIn } from 'lucide-react'
import Link from 'next/link'
export default async function Nav() {
  const session = await auth()
  return (
    <header className='mt-4'>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="logo">
            <Link href={'/'}><Logo/></Link>
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
