import Link from "next/link"
import { Icon } from '@iconify/react'
import { LoggedInUserProps, SongProps } from "@/app/utils"
import { db } from "@/firebase"
import { DocumentData, arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import { loggedInUser } from "@/app/state/atoms"
import { useParams } from "next/navigation"
import { SetterOrUpdater, useRecoilValue } from "recoil"
import CardItemName from "./CardItemName"
import { formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"



type Props = {
  id: string,
  index: number,
  likeLoading: boolean,
  setLikeLoading: SetterOrUpdater<boolean>,
  setUser: SetterOrUpdater<DocumentData | LoggedInUserProps | null>
  user: LoggedInUserProps | null | DocumentData,
  removeFromPlaylist: (songId: string) => Promise<void>
}

const CardRowItem = ({ id, index, likeLoading, setLikeLoading, setUser, user, removeFromPlaylist }: Props) => {
    const [song, setSong] = useState<SongProps | null | DocumentData>(null)
    const [cardItemNameLoading, setCardItemNameLoading] = useState<boolean>(false)
    const [checkingLike, setCheckingLike] = useState<boolean>(false)
    const [liked, setLiked] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
      const getSong = async (id: string) => {
        setLoading(true)
        try {
          const docRef = doc(db, "songs", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
          //   console.log(docSnap.data())
            setSong({songUrl: id,...docSnap.data()})
          } else {
            setSong(null)
          }
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
      }
      getSong(id)
    },[id,setSong])

    const handleLike = async (id: string) => {
      if (user) {
        setLikeLoading(true)
        try {
            if (liked) {
                const likedSongsRef = doc(db, "users", user.id);
                // Atomically remove a song to the "songs" array field.
                await updateDoc(likedSongsRef, {
                  songs: arrayRemove(id)
                });
                const { songs } = user
                const newLikedList = songs.filter((songId: string) => id !== songId)
                setUser({ ...user, songs: newLikedList })
                toast.success('Song disliked.')
            } else {
                const likedSongsRef = doc(db, "users", user.id);
                // Atomically add a new song to the "songs" array field.
                await updateDoc(likedSongsRef, {
                  songs: arrayUnion(id)
                });
                const { songs } = user
                const newLikedList = [...songs,id]
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
        typeof(id) === "string" && user && checkLikedSong(id)
    },[id,user])

  const active = song?.owner === user?.id



  return (
    <>
      {(loading || cardItemNameLoading) ? (
        <div className="h-16 mb-1 bg-gray-900 rounded-xl w-full"></div>
      ) : (
        <>
          {/* <div className="flex items-center justify-between gap-3 group hover:bg-gray-900 transition-all rounded-xl px-5 py-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-5 h-5 flex items-center justify-center opacity-100 transition-all group-hover:opacity-0 group-hover:hidden">
                <p className="text-gray-500 text-[13px]">{index}</p>
              </div>
              <button type="button" className="w-5 h-5 group-hover:inline-flex items-center justify-center opacity-0 transition-all group-hover:opacity-100 hidden">
                <Icon icon="line-md:pause-to-play-filled-transition" className="text-xl text-white" />
              </button>
              <div className="grid gap-0.5">
                <Link href={`/track/${id}`} className="text-white capitalize text-sm font-bold transition-all hover:underline focus:underline active:underline truncate">
                  {song?.name}
                </Link>
                <CardItemName owner={song?.owner} active={active} />
              </div>
            </div>
            <p className="hidden md:block md:w-1/5 group-hover:text-white text-gray-500 text-sm font-semibold transition-all truncate capitalize">{song?.genre}</p>
            { song?.createdAt && <p className="hidden md:block md:w-1/5 text-gray-500 text-sm font-semibold transition-all truncate">{formatDistanceToNow(new Date(song?.createdAt))}</p> }
            <div className="flex items-center justify-end gap-5 w-2/5 md:w-1/5">
              <button type="button" disabled={likeLoading} onClick={()=>handleLike(id)} className="disabled:cursor-not-allowed bg-transparent text-gray-500 hover:text-white focus:text-white active:text-white transition-all lg:opacity-0 lg:group-hover:opacity-100">
                {likeLoading ? (
                  <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
                ) : (
                  <>{user?.songs?.includes(id) ? <Icon icon="line-md:heart-filled" className="text-xl text-green-500" /> : <Icon icon="line-md:heart" className="text-xl" />}</>
                )}
              </button>
              <p className="text-gray-500 text-[13px] text-right truncate">
                {song?.duration.split(':')[0] !== "00" ? `${song?.duration}` : `${song?.duration.slice(3)}`}
              </p>
              <button type="button" onClick={()=>removeFromPlaylist(id)} className="text-gray-500 hover:text-white focus:text-white active:text-white transition-all group/btn lg:opacity-0 lg:group-hover:opacity-100 relative">
                <Icon icon="mdi:delete-empty" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 lg:group-hover/btn:opacity-0 transition-all" />
                <Icon icon="mdi:delete-sweep" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 lg:group-hover/btn:opacity-100 transition-all" />
              </button>
            </div>
          </div> */}
          <div className="flex items-center justify-between gap-5 group hover:bg-gray-900 transition-all rounded-xl px-5 py-3">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-5 h-5 flex items-center justify-center opacity-100 transition-all">
              <p className="text-gray-500 text-[13px]">{index}</p>
            </div>
            {/* <button type="button" className="w-5 h-5 group-hover:inline-flex items-center justify-center opacity-0 transition-all group-hover:opacity-100 hidden">
              <Icon icon="line-md:pause-to-play-filled-transition" className="text-xl text-white" />
            </button> */}
            <div className="grid gap-0.5">
              <Link href={`/track/${id}`} className="text-white text-sm capitalize font-bold transition-all hover:underline focus:underline active:underline truncate">
                {song?.name}
              </Link>
              <CardItemName owner={song?.owner} active={active} />
            </div>
          </div>
          <p className="hidden md:block md:w-1/5 group-hover:text-white text-gray-500 text-sm font-semibold transition-all truncate capitalize">{song?.genre}</p>
          { song?.createdAt && <p className="hidden md:block md:w-1/5 text-gray-500 text-sm font-semibold transition-all truncate">{formatDistanceToNow(new Date(song?.createdAt))}</p> }
          <div className="flex items-center justify-end gap-5 w-2/5 md:w-1/5">
            <button type="button" disabled={likeLoading} onClick={()=>handleLike(id)} className="disabled:cursor-not-allowed bg-transparent text-gray-500 hover:text-white focus:text-white active:text-white transition-all md:opacity-0 md:group-hover:opacity-100">
              {likeLoading ? (
                <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
              ) : (
                <>{liked ? <Icon icon="line-md:heart-filled" className="text-xl text-green-500" /> : <Icon icon="line-md:heart" className="text-xl" />}</>
              )}
            </button>
            <p className="text-gray-500 text-[13px] text-right truncate">
              {song?.duration.split(':')[0] !== "00" ? `${song?.duration}` : `${song?.duration.slice(3)}`}
            </p>
            <button type="button" onClick={()=>removeFromPlaylist(id)} className="text-gray-500 hover:text-white focus:text-white active:text-white transition-all group/btn lg:opacity-0 lg:group-hover:opacity-100 relative">
              <Icon icon="mdi:delete-empty" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 lg:group-hover/btn:opacity-0 transition-all" />
              <Icon icon="mdi:delete-sweep" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 lg:group-hover/btn:opacity-100 transition-all" />
            </button>
          </div>
        </div>
        </>
      )}
    </>
  )
}

export default CardRowItem