'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { MenuIcon } from "lucide-react";
import Image from 'next/image'
import {
  CloudUpload
} from "lucide-react";
type Props = {}

const Navbar = (props: Props) => {
  const [isSignedIn, setisSignedIn] = useState(false);
  return (
    <div>
      <header className='rounded-full  m-auto mt-5 w-[60vw] fixed left-0 top-0 right-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between'>
        <Link href={"/"}>
          <aside className='flex items-center gap-[2px]'>
            <p className='text-3xl font-bold'></p>
            <CloudUpload className="h-15 w-15 text-primary" />  <h2 className="text-lg font-bold">CloudBox</h2>
          </aside>
        </Link>
        {/* <nav className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
          <ul className='flex items-center gap-4 list-none'>
            <li>
              <Link href="#">Products</Link>
            </li>
            <li>
              <Link href="#">Pricing</Link>
            </li>
            <li>
              <Link href="#">About us</Link>
            </li>
          </ul>
        </nav> */}
        <aside className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              {isSignedIn ? 'Dashboard' : 'Get Started'}
            </span>
          </Link>
          {/* {user ? <UserButton afterSignOutUrl="/" /> : null} */}
          <MenuIcon className="md:hidden" />
        </aside>
      </header>
    </div>
  )
}

export default Navbar