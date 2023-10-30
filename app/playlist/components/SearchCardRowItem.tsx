"use client"

import Link from "next/link"
import { Icon } from '@iconify/react'
import { SongProps } from "@/app/utils"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import Image from "next/image"


type Props = {
    active: boolean,
    song: SongProps,
    updatePlaylist: (a: string) => Promise<void>,
    updatePlaylistLoading: boolean
}

const SearchCardRowItem = ({ active, song, updatePlaylist, updatePlaylistLoading }: Props) => {

    const [name, setName] = useState<string | null>('')
    
    useEffect(() => {
        const getOwner = async (owner: string) => {
          const docRef = doc(db, "users", owner);
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setName(`${docSnap.data().userName}`)
          } else {
            setName(null)
          }
        }
        getOwner(song?.owner)
    },[song,setName])

  return (
    <div className="flex items-center justify-between gap-3 group hover:bg-gray-900 transition-all rounded-xl px-5 py-3">
        <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gray-700 relative overflow-hidden grid place-content-center">
                {song && song.imgUrl.trim() !== "" ? (
                    <div className="absolute inset-0 cursor-pointer transition-all">
                        <Image src={song.imgUrl} alt="Selected file" layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
                    </div>
                ) : (
                    <h4 className="text-2xl font-bold uppercase text-gray-200">{song?.name[0]}</h4>
                )}
                {/* <button type="button" className="absolute inset-0 bg-[#00000040] group-hover:inline-flex items-center justify-center opacity-0 transition-all group-hover:opacity-100 group-focus:opacity-100 hidden">
                    <Icon icon="line-md:pause-to-play-filled-transition" className="text-xl text-white" />
                </button> */}
            </div>
            <div className="grid gap-0.5">
                <Link href={`/track/${song?.id}`} className="text-white capitalize text-sm font-bold transition-all hover:underline focus:underline active:underline truncate">
                    {song?.name}
                </Link>
                <Link href={`${active ? '/user' :`/artist/${song?.owner}`}`} className="text-gray-500 font-bold text-sm transition-all hover:underline focus:underline active:underline truncate">
                    {name}
                </Link>
            </div>
        </div>
        <p className="hidden md:block md:w-[35%] group-hover:text-white text-gray-500 text-[13px] md:text-sm font-semibold transition-all truncate pl-10 capitalize">
            {song?.genre}
        </p>
        <div className="flex items-center justify-end gap-5 w-1/3 md:w-1/5">
            <button
                type="button"
                onClick={()=>updatePlaylist(song?.id)}
                disabled={updatePlaylistLoading}
                className="text-white font-medium py-1 px-5 rounded-lg border disabled:bg-white disabled:text-gray-900 disabled:cursor-not-allowed flex items-center justify-center border-gray-700 hover:border-white focus:border-white active:border-white transition-all"
            >
                { updatePlaylistLoading ? ( <Icon icon="svg-spinners:eclipse-half" className="text-2xl md:text-3xl" /> ) : ( <>Add</> )}
            </button>
        </div>
    </div>
  )
}

export default SearchCardRowItem