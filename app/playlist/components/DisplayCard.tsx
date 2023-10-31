import Link from "next/link"
import { Icon } from '@iconify/react'
import { LoggedInUserProps, PlaylistsProps, SongProps } from "@/app/utils"
import { db } from "@/firebase"
import { DocumentData, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { useState, useEffect } from "react"
import { loggedInUser } from "@/app/state/atoms"
import { useParams } from "next/navigation"
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from "recoil"
import CardItemName from "./CardItemName"
import { formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"
import Image from "next/image"


type Props = {
  playlist: PlaylistsProps | null | DocumentData,
  user: LoggedInUserProps | DocumentData | null
}

const DisplayCard = ({ playlist, user }: Props) => {
    const [song, setSong] = useState<SongProps | null | DocumentData>(null)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
      if (playlist && playlist.songs.length > 0) {
        const getSong = async (id: string) => {
          setLoading(true)
          try {
            const docRef = doc(db, "songs", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setSong(docSnap.data())
            } else {
              setSong(null)
            }
          } catch (error: any) {
            toast.error(error.message)
          } finally {
            setLoading(false)
          }
        }
        getSong(playlist.songs[0])
      }
    },[playlist,setSong])


  return (
    <>
      {loading ? (
        <div className="w-36 h-36 md:w-60 md:h-52 lg:h-48 lg:w-52 2xl:w-56 2xl:h-56 bg-gray-900"></div>
      ) : (
        <div className="w-36 h-36 md:w-60 md:h-52 lg:h-48 lg:w-52 2xl:w-56 2xl:h-56 bg-gray-700 shadow-slate-700 shadow-2xl overflow-hidden relative grid place-content-center">
            {song && song.imgUrl.trim() !== "" ? (
            <div className="absolute inset-0 cursor-pointer transition-all">
                <Image src={song?.imgUrl} alt={`${playlist?.name}'s image`} layout="fill" className="absolute inset-0 object-cover" />
            </div>
            ) : (
            <h2 className="text-9xl text-gray-200 font-bold uppercase">{song?.name[0] ?? playlist?.name[0]}</h2>
            )}
        </div>
      )}
    </>
  )
}

export default DisplayCard