"use client"

import { useState } from "react"
import Link from "next/link"
import { useRecoilValue } from "recoil"


import { selectedGenre } from "@/app/state/atoms"
import SectionRow from "@/app/components/SectionRow"
import { handleTitle } from "@/app/utils"
import AppLayout from "../../components/layouts/AppLayout"

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
      <div className="pt-12 pb-7">
        <h1 className="text-8xl font-black text-white capitalize">{handleTitle(genre)}</h1>
        <div className="py-7 flex items-center gap-5 flex-wrap">
          {genreTab.map(({name,id},index) => (
            <Link href={id} key={index} className="flex items-center gap-4 w-fit px-4 py-1.5 font-medium rounded-xl bg-gray-700 text-sm text-white capitalize hover:bg-gray-800 focus:bg-gray-800 active:bg-gray-800 transition-all">
              {/* <Icon icon={icon} className="text-xl" /> */}
              {name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-7 py-10">
          <SectionRow title="Trending" />
          <SectionRow title="New Releases" />
          <SectionRow title="Popular" />
          <SectionRow title="Playlists" playlist />
          <SectionRow title="Artists" artist />
          <SectionRow title="Praise" />
        </div>
      </div>
    </AppLayout>
  )
}

export default Page