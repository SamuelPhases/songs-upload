"use client"

import { Icon } from '@iconify/react'
import Link from "next/link"
import { useState, useEffect } from "react"

type Props = {}

const NewContent = (props: Props) => {

    // const [isClient, setIsClient] = useState(false)
  
    // useEffect(() => {
    //   setIsClient(true)
    // }, [])

    // if (!isClient) return null

  return (
    <div className="p-3 pb-5 rounded-lg flex gap-7 items-start relative group">
        <button type="button" className="absolute bg-transparent transition-all rounded-lg inset-0 active:bg-gray-900/50 focus:bg-gray-900/50 hover:bg-gray-900/50 group-hover:bg-gray-900/50 group-focus:bg-gray-900/50 group-active:bg-gray-900/50"></button>
        <div className="h-28 w-28 rounded-lg bg-gray-50/50 overflow-hidden z-10"></div>
        <div className="h-full flex flex-col justify-between gap-7 z-10 flex-1">
            <div className="grid gap-1">
                <Link href="/album/1" className="text-white text-base line-clamp-2 font-semibold transition hover:underline focus:underline active:underline truncate">Undignified (Excuse Me)</Link>
                <Link href="/artist/1" className="text-gray-300/50 text-sm transition font-semibold hover:underline focus:underline active:underline line-clamp-2">Dunsin Oyekan</Link>
                <div className="flex items-center gap-1 text-white py-1">
                    <p className="text-sm">Single</p>
                    <Icon icon="icon-park-outline:dot" className="text-white text-sm" />
                    <p className="text-sm">3 days ago</p>
                </div>
            </div>
            <div className="flex items-center justify-between gap-7 flex-wrap w-full">
                <div className="flex items-center gap-5">
                    <button type="button" className="text-gray-500 hover:text-white focus:text-white active:text-white">
                        <Icon icon="line-md:heart" className="text-2xl" />
                    </button>
                    <button type="button" className="text-gray-500 hover:text-white focus:text-white active:text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100">
                        <Icon icon="svg-spinners:3-dots-move" className="text-2xl" />
                    </button>
                </div>
                <button type="button" className="w-9 h-9 rounded-full bg-gray-900 text-gray-200 hover:animate-pulse focus:animate-pulse active:animate-pulse hover:text-gray-900 focus:text-gray-900 active:text-gray-900 group-hover:bg-white group-hover:text-gray-900 group-focus:text-gray-900 group-focus:bg-white group-active:bg-white group-active:text-gray-900 flex items-center justify-center">
                    <Icon icon="line-md:play-filled" className="text-3xl" />
                </button>
            </div>
        </div>
    </div>
  )
}

export default NewContent