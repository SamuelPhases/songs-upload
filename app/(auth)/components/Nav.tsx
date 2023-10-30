"use client"

import { Icon } from '@iconify/react'
import Link from "next/link"

type Props = {}

const Nav = (props: Props) => {

  const navLinks = ['premium','support','about']

  return (
    <nav className="w-full flex items-center justify-center py-4 bg-black">
      <div className="flex items-center justify-between gap-7 w-[95%] md:w-[90%] mx-auto">
        <div className="flex items-center gap-1 justify-center flex-wrap">
          <Link href="/">
            <Icon icon="arcticons:songsterr" className="text-5xl text-white" />
          </Link>
          <Link href="/">
            <h3 className="text-3xl font-extrabold text-white">Songs</h3>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Nav