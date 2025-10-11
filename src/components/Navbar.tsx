"use client"

import Link from 'next/link'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'




const Navbar = () => {

    const {data: session} = useSession()

    const user: User = session?.user as User

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-black/90 to-black/95 backdrop-blur-lg border-b border-green-500/40 shadow-[0_0_25px_rgba(0,255,0,0.3)] transition-all duration-300">
  <div className="max-w-7xl mx-auto px-5 sm:px-10 flex items-center justify-between h-16 md:h-20">
    {/* Logo / Brand */}
    <Link
      href="/"
      className="relative text-green-400 font-mono font-extrabold text-xl sm:text-2xl md:text-3xl tracking-widest drop-shadow-[0_0_10px_rgba(0,255,0,0.6)] hover:drop-shadow-[0_0_20px_rgba(0,255,0,0.8)] transition-all duration-300"
    >
      <span className="before:absolute before:-inset-1 before:bg-green-500/10 before:blur-md before:rounded-lg before:opacity-0 hover:before:opacity-100 transition-all duration-500">
        <span className="relative">Incognito Message</span>
      </span>
    </Link>

    {/* Nav Links (Optional) */}
    {/* <div className="hidden md:flex gap-8 text-green-300 font-mono text-sm lg:text-base">
      <a
        href="/dashboard"
        className="relative group hover:text-green-400 transition-all duration-200"
      >
        Dashboard
        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
      </a>
      <a
        href="/about"
        className="relative group hover:text-green-400 transition-all duration-200"
      >
        About
        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
      </a>
      <a
        href="/contact"
        className="relative group hover:text-green-400 transition-all duration-200"
      >
        Contact
        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
      </a>
    </div> */}

    {/* Session Buttons */}
    <div className="flex items-center gap-3 sm:gap-5">
      {session ? (
        <>
          <span className="hidden sm:inline text-green-300 font-mono text-sm md:text-base">
            Welcome,&nbsp;
            <span className="text-green-400 font-semibold">
              {user?.username || user?.email}
            </span>
          </span>
          <Button
            onClick={() => signOut()}
            className="border border-green-400 bg-transparent text-green-400 hover:bg-green-500 hover:text-black rounded-md px-4 py-2 text-sm md:text-base font-mono shadow-[0_0_10px_rgba(0,255,0,0.4)] hover:shadow-[0_0_20px_rgba(0,255,0,0.8)] transition-all duration-300"
          >
            Logout
          </Button>
        </>
      ) : (
        <Link href="/sign-in">
          <Button className="border border-green-400 bg-transparent text-green-400 hover:bg-green-500 hover:text-black rounded-md px-4 py-2 text-sm md:text-base font-mono shadow-[0_0_10px_rgba(0,255,0,0.4)] hover:shadow-[0_0_20px_rgba(0,255,0,0.8)] transition-all duration-300">
            Login
          </Button>
        </Link>
      )}
    </div>
  </div>

  {/* Mobile Menu (Optional for smaller screens) */}
  {/* <div className="md:hidden border-t border-green-500/30 bg-black/90 text-green-300 font-mono text-center py-2">
    <a href="/dashboard" className="block py-2 hover:text-green-400">
      Dashboard
    </a>
    <a href="/about" className="block py-2 hover:text-green-400">
      About
    </a>
    <a href="/contact" className="block py-2 hover:text-green-400">
      Contact
    </a>
  </div> */}
</nav>


  )
}

export default Navbar