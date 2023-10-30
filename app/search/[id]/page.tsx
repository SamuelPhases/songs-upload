"use client"
import { useState, useEffect } from "react"

import AppLayout from "@/app/components/layouts/AppLayout"
import Title from "@/app/components/Title"
import Card from "@/app/components/Card"
import TopResultCard from "@/app/components/TopResultCard"
import SectionRow from "@/app/components/SectionRow"
import SongsRowSearch from "@/app/components/SongsRowSearch"

type Props = {}

const Page = (props: Props) => {

    const [isClient, setIsClient] = useState(false)
  
    useEffect(() => {
      setIsClient(true)
    }, [])
  
    if (!isClient) return null

    const searchFilter = ['all', 'artists', 'playlists', 'songs', 'albums', 'profiles']

  return (
    <AppLayout>
        <div className="flex items-center gap-4 flex-wrap fixed w-[76%] bg-gray-900 z-20 -mt-7 -ml-5 px-5 pb-3">
            {searchFilter.map((name,index) => (
                <button type="button" key={index} className="transition w-fit px-4 py-1.5 font-medium rounded-xl bg-gray-700 text-sm text-white capitalize hover:bg-gray-800 focus:bg-gray-800 active:bg-gray-800">
                    {name}
                </button>
            ))}
        </div>
        <div className="flex items-start gap-10 py-10">
            <div className="grid gap-7 w-[30%]">
                <Title title="Top result" />
                <TopResultCard/>
            </div>
            <div className="grid gap-5 flex-1">
                <Title title="Songs" />
                <div className="grid">
                    <SongsRowSearch/>
                    <SongsRowSearch/>
                    <SongsRowSearch/>
                    <SongsRowSearch/>
                    <SongsRowSearch/>
                </div>
            </div>
        </div>
        <div className="grid gap-10 py-5">
            <div>
                <SectionRow nullActionableTitle title="Featuring 1Spirit & Theophilus Sunday" />
            </div>
            <div>
                <SectionRow artist nullActionableTitle title="Artists" />
            </div>
            <div>
                <SectionRow playlist nullActionableTitle title="Playlists" />
            </div>
            <div>
                <SectionRow profile nullActionableTitle title="Profiles" />
            </div>
        </div>
    </AppLayout>
  )
}

export default Page