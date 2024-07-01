"use client"
import { cn } from '@/lib/utils'
import {AnimatePresence, motion} from 'framer-motion'
import Link from "next/link"
import { usePathname } from "next/navigation"


export default function DashboardNav({allLinks} : {allLinks : {label : string, path : string, icon : JSX.Element}[]}) {
  const pathname = usePathname()
  return (
    <nav>
    <ul className="flex gap-12 font-bold text-sm">
      <AnimatePresence>
          {allLinks.map((link, ind) => (
            <motion.li whileTap={{scale : 0.90}} key={ind}>
              <Link className={cn("flex flex-col relative items-center gap-2", pathname === link.path && 'text-primary')} href={link.path}>
              {link.icon} 
              {link.label}
              {pathname === link.path ? (
                <motion.div className='h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-2'
                initial={{ scale : 0.8 }} animate={{ scale : 1 }} layoutId='underline'/>
              ) : null}
              </Link>
            </motion.li>
          ))}
      </AnimatePresence>
    </ul>
  </nav>
  )
}
