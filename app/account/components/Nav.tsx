"use client"

import { Icon } from '@iconify/react'
import Link from "next/link"

type Props = {}

const Nav = (props: Props) => {

  const navLinks = ['premium','support','about']

  return (
    <nav className="w-full flex items-center justify-center bg-neutral-900/50">
      <div className="flex items-center justify-between gap-7 w-[95%] md:w-[90%] lg:w-4/5 2xl:w-3/5 mx-auto">
        <div className="flex items-center gap-1 justify-center flex-wrap">
          <Link href="/">
            <Icon icon="arcticons:songsterr" className="text-3xl text-white" />
          </Link>
          <Link href="/">
            <h3 className="text-3xl font-extrabold text-white">Songs</h3>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {navLinks.map((url,index) => (
              <Link href={`/${url}`} key={index} className="text-white hover:text-blue-800 px-3 py-5 focus:text-blue-800 active:text-blue-800 transition-all capitalize font-bold">{url}</Link>
            ))}
          </div>
          <div className="w-0.5 h-8 bg-gray-400/50"></div>
          <button type="button" className="flex items-center gap-3 hover:text-blue-800 focus:text-blue-800 active:text-blue-800 transition-all font-bold text-white">
            <Icon icon="codicon:account" className="text-4xl" />
            Profile
            <Icon icon="ep:arrow-down" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav