import Link from "next/link"
import { Icon } from '@iconify/react'
import { Dispatch, SetStateAction, useEffect, useState } from "react"

import { LoggedInUserProps, SongProps } from "@/app/utils"
import { db } from "@/firebase"
import { DocumentData, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import CardItemName from "./CardItemName"
import { SetterOrUpdater, useRecoilState, useRecoilValue } from "recoil"
import { likedLoading, loggedInUser } from "@/app/state/atoms"
import toast from "react-hot-toast"



type Props = {
  deleting: boolean,
  id: string,
  index: number,
  likeLoading: boolean,
  setDeleting:  Dispatch<SetStateAction<boolean>>,
  setLikeLoading: SetterOrUpdater<boolean>,
  setUser: SetterOrUpdater<DocumentData | LoggedInUserProps | null>,
  viewHistory: DocumentData | string[],
  refactorViewHistory: DocumentData | string[],
  setRefactorViewHistory: Dispatch<SetStateAction<string[]>>,
  setViewHistory: Dispatch<SetStateAction<string[]>>,
  user: LoggedInUserProps | null | DocumentData,
}

const CardRowItem = ({ deleting, id, index, likeLoading, setDeleting, setLikeLoading, viewHistory, refactorViewHistory, setRefactorViewHistory, setViewHistory, setUser, user }: Props) => {

    const [song, setSong] = useState<SongProps | null | DocumentData>(null)
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
        typeof(id) === "string" && user && checkLikedSong(id)
    },[id,user])

    useEffect(() => {
        const getSong = async () => {
            const docRef = doc(db, "songs", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // setSong({id,...docSnap.data()})
                setSong(docSnap.data())
            } 
        }
        getSong()
    },[id])

    const deleteSong = async (id: string) => {
      if (user) {
        if (user.id === song?.owner) {
          setDeleting(true)
          try {
            liked && handleLike(id)
            const playlistsRef = collection(db, "playlists");
            const q = query(playlistsRef, where("songs", "array-contains", id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach( async(document) => {
              // doc.data() is never undefined for query doc snapshots
              const playlistRef = doc(db, "playlists", document.id);
              const playlistDocSnap = await getDoc(playlistRef);
              if (playlistDocSnap.exists()) {
                await updateDoc(playlistRef, {
                  songs: arrayRemove(id)
                });
              }
            });
            const usersRef = collection(db, "users");
            const qUsers = query(usersRef, where("songs", "array-contains", id));
            const queryUsersSnapshot = await getDocs(qUsers);
            queryUsersSnapshot.forEach( async(document) => {
              // doc.data() is never undefined for query doc snapshots
              const usersRef = doc(db, "users", document.id);
              const userDocSnap = await getDoc(usersRef);
              if (userDocSnap.exists()) {
                await updateDoc(usersRef, {
                  songs: arrayRemove(id)
                });
              }
            });
            const docRef = doc(db, "views", user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              await updateDoc(docRef, {
                history: arrayRemove(id)
              });
              // const { songs } = user
              // const newLikedList = [...songs,songId]
              // setUser({ ...user, songs: newLikedList })
              const newViewHistory = viewHistory.filter((trackId: string) => trackId !== id)
              setViewHistory(newViewHistory)
              const newRefactorViewHistory = refactorViewHistory.filter((trackId: string) => trackId !== id)
              setRefactorViewHistory(newRefactorViewHistory)
            }
            await deleteDoc(doc(db, "songs", id))
            toast.success('Deleted song')
          } catch (error: any) {
            toast.error(error.message)
          } finally {
            setDeleting(false)
          }
        } else {
          toast.error('You can only delete songs uploaded by you.')
        }
      } else {
        toast.error('You need to login to perform this action')
      }
    }


  return (
    <>
      <div className="hidden md:flex items-center justify-between gap-3 group hover:bg-gray-900 transition-all rounded-xl px-5 py-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-5 h-5 flex items-center justify-center opacity-100 transition-all group-hover:opacity-0 group-hover:hidden">
            <p className="text-gray-500 text-[13px]">{index}</p>
          </div>
          <button type="button" className="w-5 h-5 group-hover:inline-flex items-center justify-center opacity-0 transition-all group-hover:opacity-100 hidden">
            <Icon icon="line-md:pause-to-play-filled-transition" className="text-xl text-white" />
          </button>
          <div className="grid gap-0.5">
            <Link href={`/track/${id}`} className="text-white text-sm font-bold transition-all hover:underline focus:underline active:underline truncate capitalize line-clamp-1">
              {song?.name}
            </Link>
            <CardItemName owner={song?.owner} user={user} />
          </div>
        </div>
        {/* <p className="w-[20%] group-hover:text-white text-gray-500 text-[13px] transition-all text-right truncate">19,957,095</p> */}
        <div className="flex items-center justify-end gap-5 w-1/4">
          <button type="button" disabled={likeLoading} onClick={()=>handleLike(id)} className="disabled:cursor-not-allowed bg-transparent text-gray-500 hover:text-white focus:text-white active:text-white transition-all lg:opacity-0 lg:group-hover:opacity-100">
            {likeLoading ? (
              <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
            ) : (
              <>{liked ? <Icon icon="line-md:heart-filled" className="text-xl text-green-500" /> : <Icon icon="line-md:heart" className="text-xl" />}</>
            )}
          </button>
          <p className="text-gray-500 text-[13px] text-right truncate">
            {song?.duration.split(':')[0] !== "00" ? `${song?.duration}` : `${song?.duration.slice(3)}`}
          </p>
          {user?.id === song?.owner ? (
            <button type="button" disabled={deleting} onClick={()=>deleteSong(id)} className="disabled:cursor-not-allowed text-gray-500 ml-2 hover:text-white group/btn relative focus:text-white active:text-white transition-all lg:opacity-0 lg:group-hover:opacity-100">
              {deleting ? (
                <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
              ) : (
                <>
                  <Icon icon="mdi:delete-empty" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:opacity-100 lg:group-hover/btn:opacity-0 transition-all" />
                  <Icon icon="mdi:delete-sweep" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:opacity-0 lg:group-hover/btn:opacity-100 transition-all" />
                </>
              )}
            </button>
          ) : (
            <button type="button" disabled className="text-gray-500 ml-2 disabled:cursor-not-allowed hover:text-white group/btn relative focus:text-white active:text-white transition-all lg:opacity-0 lg:group-hover:opacity-100">
              <Icon icon="mdi:delete-empty" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:opacity-100 lg:group-hover/btn:opacity-0 transition-all" />
              <Icon icon="mdi:delete-sweep" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:opacity-0 lg:group-hover/btn:opacity-100 transition-all" />
            </button>
          )}
        </div>
      </div>
      <div className="flex md:hidden flex-col gap-3 group hover:bg-gray-900 transition-all rounded-xl px-2 py-3 mb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 flex items-center justify-center opacity-100 transition-all">
              <p className="text-gray-500 text-[13px]">{index}</p>
            </div>
            {/* <button type="button" className="w-5 h-5 group-hover:inline-flex items-center justify-center opacity-0 transition-all group-hover:opacity-100 hidden">
              <Icon icon="line-md:pause-to-play-filled-transition" className="text-xl text-white" />
            </button> */}
            <div className="grid gap-0.5">
              <Link href={`/track/${id}`} className="text-white text-sm font-bold transition-all hover:underline focus:underline active:underline truncate capitalize line-clamp-1">
                {song?.name}
              </Link>
            </div>
          </div>
          <CardItemName owner={song?.owner} user={user} />
        </div>
        <div className="flex items-center justify-between gap-5 w-full">
          <button type="button" disabled={likeLoading} onClick={()=>handleLike(id)} className="disabled:cursor-not-allowed bg-transparent text-gray-500 hover:text-white focus:text-white active:text-white transition-all">
            {likeLoading ? (
              <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
            ) : (
              <>{liked ? <Icon icon="line-md:heart-filled" className="text-xl text-green-500" /> : <Icon icon="line-md:heart" className="text-xl" />}</>
            )}
          </button>
          <p className="text-gray-500 text-[13px] text-right truncate">
            {song?.duration.split(':')[0] !== "00" ? `${song?.duration}` : `${song?.duration.slice(3)}`}
          </p>
          {user?.id === song?.owner ? (
            <button type="button" disabled={deleting} onClick={()=>deleteSong(id)} className="disabled:cursor-not-allowed text-gray-500 ml-2 hover:text-white group/btn relative focus:text-white active:text-white transition-all">
              {deleting ? (
                <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
              ) : (
                <>
                  <Icon icon="mdi:delete-empty" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 group-hover/btn:opacity-0 transition-all" />
                  <Icon icon="mdi:delete-sweep" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/btn:opacity-100 transition-all" />
                </>
              )}
            </button>
          ) : (
            <button type="button" disabled className="text-gray-500 ml-2 disabled:cursor-not-allowed hover:text-white group/btn relative focus:text-white active:text-white transition-all">
              <Icon icon="mdi:delete-empty" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 group-hover/btn:opacity-0 transition-all" />
              <Icon icon="mdi:delete-sweep" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/btn:opacity-100 transition-all" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default CardRowItem