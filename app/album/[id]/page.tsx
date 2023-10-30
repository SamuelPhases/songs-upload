"use client"

import { useState } from "react"
import { Icon } from '@iconify/react'
import { useRecoilValue } from "recoil"


import { selectedGenre } from "@/app/state/atoms"
import SectionRow from "@/app/components/SectionRow"
import AppLayout from "../../components/layouts/AppLayout"
import CardInfo from "../components/CardInfo"
import CardRowItem from "../components/CardRowItem"



type Props = {}

const Page = (props: Props) => {

  // const [isClient, setIsClient] = useState(false)
  
  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  const [genreTab, setGenreTab] = useState([
    {
      name: 'Christian',
      id: ''
    },
    {
      name: 'Gospel',
      id: ''
    },
    {
      name: 'Worship',
      id: ''
    },
    {
      name: 'Praise',
      id: ''
    }
  ])
  const genre = useRecoilValue(selectedGenre)


  // if (!isClient) return null

  return (
    <AppLayout> 
      <div className="pb-7">
        <div className="flex items-end gap-5 w-full pt-14 pb-5 text-white">
            <div className="w-56 h-56 bg-yellow-500 shadow-slate-700 shadow-2xl"></div>
            <div className="grid gap-7 w-4/5">
                <div className="grid gap-3">
                    <p className="text-sm">Album</p>
                    <h1 className="text-7xl line-clamp-2 font-black text-white capitalize">The Glory Experience (Songs of Zion)</h1>
                </div>
                <CardInfo/>
            </div>
        </div>
        <div className="flex items-center gap-7 flex-wrap py-5">
            <button type="button" className="w-14 h-14 text-white bg-green-600 flex items-center justify-center rounded-full hover:animate-pulse focus:animate-pulse active:animate-pulse transition-all">
                <Icon icon="line-md:pause-to-play-filled-transition" className="text-4xl" />
            </button>
            <button type="button" className="text-gray-500 hover:text-white focus:text-white active:text-white transition-all">
                <Icon icon="line-md:heart" className="text-4xl" />
            </button>
            <button type="button" className="text-gray-400/50 hover:text-white focus:text-white active:text-white flex items-center justify-center transition-all">
                <Icon icon="tabler:dots" className="text-3xl" />
            </button>
        </div>
        <div className="py-5 flex items-start gap-10 w-full">
            <div className="w-full flex flex-col gap-5">
                <div className="flex items-center justify-between gap-5 text-gray-500 py-2 border-b border-b-gray-700 pl-7 pr-[70px]">
                {/* <div className="flex items-center justify-between gap-5 text-gray-500 py-2 border-b border-b-gray-700 pl-7 pr-12"> */}
                    <div className="flex items-center gap-5">
                        <p className="text-sm font-bold">#</p>
                        <p className="text-sm font-bold">Title</p>
                    </div>
                    <Icon icon="ri:time-line" className="text-base" />
                </div>
                <div className="grid gap-5 w-full">
                    <div className="w-full">
                        <CardRowItem/>
                        <CardRowItem/>
                        <CardRowItem/>
                        <CardRowItem/>
                        <CardRowItem/>
                        <CardRowItem/>
                        <CardRowItem/>
                        <CardRowItem/>
                        <CardRowItem/>
                        <CardRowItem/>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid gap-1 text-gray-500">
            <p className="text-sm">October 10, 2023</p>
            <p className="text-xs">&copy; 2023 Dunsin Oyekan</p>
            <p className="text-xs">&copy; 2023 Dunsin Oyekan</p>
        </div>
        <div className="grid gap-10 py-10">
            <SectionRow title="More by Dunsin Oyekan" albums  />
        </div>
      </div>
    </AppLayout>
  )
}

export default Page