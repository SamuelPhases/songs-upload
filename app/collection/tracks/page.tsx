"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Icon } from '@iconify/react'
import { useRecoilState, useRecoilValue } from "recoil"
import { DocumentData, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { format } from "date-fns"
import toast from "react-hot-toast"


import { likedLoading, loggedInUser, selectedGenre } from "@/app/state/atoms"
import SectionRow from "@/app/components/SectionRow"
import { PlaylistsProps, useDebounce } from "@/app/utils"
import { db } from "@/firebase"
import AppLayout from "../../components/layouts/AppLayout"
import CardRowItem from "../components/CardRowItem"
import Image from "next/image"




type Props = {}

const Page = (props: Props) => {

  // const [isClient, setIsClient] = useState(false)
  
  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  const [user, setUser] = useRecoilState(loggedInUser)
  const [likeLoading, setLikeLoading] = useRecoilState(likedLoading)
  // if (!isClient) return null

  return (
    <AppLayout> 
      <div className="pb-7">
        <div className="flex flex-col items-center md:flex-row md:items-end gap-5 w-full pt-0 md:pt-14 pb-5 md:border-b md:border-b-gray-500/50 text-white">
          <div className={`w-36 h-36 md:w-60 md:h-52 lg:h-48 lg:w-52 2xl:w-56 2xl:h-56 overflow-hidden bg-gradient-to-br from-blue-500 via-purple-400 to-blue-50 grid place-items-center`}>
            <Icon icon="line-md:heart-filled" className="text-4xl md:text-7xl xl:text-9xl text-white" />
          </div>
          <div className="grid gap-7 w-full md:w-3/4 lg:w-4/5">
            <div className="grid gap-3">
                <p className="text-sm">Playlist</p>
                <h1 className={`text-left truncate w-fit font-black text-white capitalize text-2xl md:text-5xl lg:text-6xl 2xl:text-7xl md:pb-1 xl:pb-2`}>Liked Songs</h1>
            </div>
            <div className="flex items-center gap-1 text-white">
                <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
                <Icon icon="radix-icons:dot-filled" className="text-xs" />
                <p className="text-sm font-bold truncate">{user?.songs.length} song{user?.songs.length > 1 && 's'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-7 flex-wrap py-5">
          {user?.songs.length > 0 && (
            <button type="button" className="w-11 h-11 lg:w-14 lg:h-14 text-white bg-green-600 flex items-center justify-center rounded-full hover:animate-pulse focus:animate-pulse active:animate-pulse transition-all">
              <Icon icon="line-md:pause-to-play-filled-transition" className="text-3xl lg:text-4xl" />
            </button>
          )}
          <button type="button" className="text-gray-400/50 hover:text-white focus:text-white active:text-white flex items-center justify-center transition-all">
            <Icon icon="tabler:dots" className="text-3xl" />
          </button>
        </div>
        {user?.songs.length > 0 ? (
          <div className="py-5 flex items-start gap-10 w-full">
            <div className="w-full flex flex-col gap-5">
              <div className="flex items-center justify-between gap-5 text-gray-500 py-2 border-b border-b-gray-700 px-5 w-full">
                <div className="flex items-center gap-4 flex-1">
                  <p className="text-sm font-bold">#</p>
                  <p className="text-sm font-bold">Title</p>
                </div>
                <div className="hidden md:block md:w-1/5">
                  <p className="text-sm font-bold">Genre</p>
                </div>
                <div className="hidden md:block md:w-1/5">
                  <p className="text-sm font-bold">Date added</p>
                </div>
                <div className="w-2/5 md:w-1/5 md:pr-8 flex justify-end">
                  <Icon icon="ri:time-line" className="text-base" />
                </div>
              </div>
              <div className="grid gap-5 w-full">
                <div className="w-full">
                  {user?.songs.map((songId: string, index: number) => (
                    <CardRowItem key={index} index={index + 1} setLikeLoading={setLikeLoading} setUser={setUser} songId={songId} user={user} likeLoading={likeLoading} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
            <div className="grid place-items-center text-center gap-5 w-full">
                <h3 className="text-gray-200 text-2xl lg:text-4xl font-extrabold">Songs you like will appear here</h3>
                <p className="text-gray-400 text-sm lg:text-base font-medium">Save songs by tapping the heart icon.</p>
                <Link href="/search" className="py-2.5 px-5 rounded-3xl text-gray-900 hover:text-white focus:text-white active:text-white bg-white hover:bg-blue-900 focus:bg-blue-900 active:bg-blue-900 transition font-bold">Find songs</Link>
            </div>
        )}
        {/* {user?.songs.length > 0 && (
          <div className="grid gap-10 py-10">
            <SectionRow title="More by Dunsin Oyekan" albums  />
          </div>
        )} */}
      </div>
    </AppLayout>
  )
}

export default Page