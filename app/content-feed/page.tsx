"use client"

import { useState, useEffect } from "react"


import NewContent from "./components/NewContent"
import AppLayout from "../components/layouts/AppLayout"

type Props = {}

const Page = (props: Props) => {


  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const newContentTab = ['music','podcast & shows']


  return (
    <AppLayout>
      <div className="flex flex-col gap-3">
        <h1 className="text-white text-3xl font-bold">What&apos;s New</h1>
        <p className="text-base text-gray-300/50">The latest releases from artists, podcasts and shows you follow.</p>
        <div className="grid w-full max-w-[900px]">
          <div className="flex items-center gap-2 border-b border-b-gray-700 py-1">
            {newContentTab.map((filter,index) => (
              <button type="button" key={index} className="capitalize text-sm font-medium py-1.5 px-5 rounded-3xl bg-gray-800 text-white hover:bg-gray-800/50 focus:bg-gray-800/50 active:bg-gray-800/50">{filter}</button>
            ))}
          </div>
          <div className="grid gap-5 py-10">
            <NewContent/>
            <NewContent/>
            <NewContent/>
            <NewContent/>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Page