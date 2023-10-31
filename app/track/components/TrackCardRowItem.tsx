import Link from "next/link"
import { Icon } from '@iconify/react'
import { LoggedInUserProps, SongProps } from "@/app/utils"
import { db } from "@/firebase"
import { DocumentData, arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { SetterOrUpdater } from "recoil"
import Image from "next/image"


type Props = {
  index: number,
  likeLoading: boolean,
  setLikeLoading: SetterOrUpdater<boolean>,
  setUser: SetterOrUpdater<DocumentData | LoggedInUserProps | null>,
  song: SongProps,
  user: DocumentData | LoggedInUserProps | null,
}

// const TrackCardRowItem = ({ id, index, likeLoading, setLikeLoading, setUser, user }: Props) => {
const TrackCardRowItem = ({ index, likeLoading, setLikeLoading, setUser, song, user }: Props) => {

//   const [song, setSong] = useState<SongProps | null | DocumentData>(null)
  const [checkingLike, setCheckingLike] = useState<boolean>(false)
  const [liked, setLiked] = useState<boolean>(false)

  const handleLike = async (songId: string) => {
    if (user) {
      setLikeLoading(true)
      try {
        if (liked) {
          const likedSongsRef = doc(db, "users", user.id);
          // Atomically remove a song to the "songs" array field.
          await updateDoc(likedSongsRef, {
            songs: arrayRemove(songId)
          });
          const { songs } = user
          const newLikedList = songs.filter((id: string) => id !== songId)
          setUser({ ...user, songs: newLikedList })
          toast.success('Song disliked.')
        } else {
          const likedSongsRef = doc(db, "users", user.id);
          // Atomically add a new song to the "songs" array field.
          await updateDoc(likedSongsRef, {
            songs: arrayUnion(songId)
          });
          const { songs } = user
          const newLikedList = [...songs,songId]
          setUser({ ...user, songs: newLikedList })
          toast.success('Song liked.')
        }
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLikeLoading(false)
      }
    } else {
      toast.error('You need to login to like a song')
    }
  }

  useEffect(()=>{
      const checkLikedSong = async (id: string) => {
        if (user) {
          setCheckingLike(true)
          try {
              user.songs.includes(id) ? setLiked(true) : setLiked(false)
          } catch (error: any) {
            toast.error(error.message)
          } finally {
            setCheckingLike(false)
          }
        }
      }
      typeof(song.id) === "string" && user && checkLikedSong(song.id)
  },[song,user])
  


  return (
    <div className="flex items-center justify-between gap-3 group hover:bg-gray-900 transition-all rounded-xl p-2 md:px-3 lg:px-5 md:py-3">
        <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 flex items-center justify-center transition-all">
              <p className="text-gray-500 text-[13px]">{index}</p>
            </div>
            {/* <button type="button" className="w-5 h-5 group-hover:inline-flex items-center justify-center lg:opacity-0 transition-all group-hover:opacity-100 hidden">
              <Icon icon="line-md:pause-to-play-filled-transition" className="text-xl text-white" />
            </button> */}
            <div className="w-7 h-7 lg:w-9 lg:h-9 relative overflow-hidden bg-gray-700 hidden md:grid place-content-center">
                {song && song.imgUrl.trim() !== "" ? (
                  <div className="absolute inset-0 cursor-pointer transition-all">
                    <Image src={song?.imgUrl} alt="Selected file" layout="fill" className="absolute inset-0 object-cover" />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-gray-200 uppercase">{song?.name[0]}</h2>
                )}
            </div>
            <Link href={`/track/${song?.id}`} className="text-sm md:text-base text-white capitalize transition-all hover:underline focus:underline active:underline truncate">
              {song?.name}
            </Link>
        </div>
        <p className="w-1/4 group-hover:text-white text-gray-500 text-[13px] transition-all text-center md:text-right truncate">{song?.views}</p>
        <div className="flex items-center justify-end gap-5 w-1/4">
            <button type="button" disabled={likeLoading} onClick={()=>handleLike(song?.id)} className="disabled:cursor-not-allowed bg-transparent text-gray-500 hover:text-white focus:text-white active:text-white transition-all md:opacity-0 md:group-hover:opacity-100">
              {likeLoading ? (
                <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
              ) : (
                <>{liked ? <Icon icon="line-md:heart-filled" className="text-xl text-green-500" /> : <Icon icon="line-md:heart" className="text-xl" />}</>
                )}
            </button>
            <p className="text-gray-500 text-[13px] text-right truncate">
              {song?.duration.split(':')[0] !== "00" ? `${song?.duration}` : `${song?.duration.slice(3)}`}
            </p>
        </div>
    </div>
  )
}

export default TrackCardRowItem