import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from "recoil"
import { formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"
import { Icon } from '@iconify/react'


import { LoggedInUserProps, SongProps } from "@/app/utils"
import { db } from "@/firebase"
import { DocumentData, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { loggedInUser } from "@/app/state/atoms"


type Props = {
  index: number,
  likeLoading: boolean,
  setLikeLoading: SetterOrUpdater<boolean>,
  setUser: SetterOrUpdater<LoggedInUserProps | DocumentData | null>,
  songId: string,
  user: LoggedInUserProps | DocumentData
}

const CardRowItem = ({ index, likeLoading, setLikeLoading, setUser, songId, user }: Props) => {
    const [song, setSong] = useState<SongProps | null | DocumentData>(null)
    const [cardItemNameLoading, setCardItemNameLoading] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
      const getSong = async (id: string) => {
        setLoading(true)
        try {
          const docRef = doc(db, "songs", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
          //   console.log(docSnap.data())
          const userRef = doc(db, "users", docSnap.data().owner);
          const userDocSnap = await getDoc(userRef)
            if (userDocSnap.exists()) {
              setSong({...docSnap.data(), ownerId: docSnap.data().owner, owner: userDocSnap.data().userName })
            }
          } else {
            setSong(null)
          }
        } catch (error: any) {
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
      }
      getSong(songId)
    },[songId,setSong])
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
        typeof(songId) === "string" && user && checkLikedSong(songId)
    },[songId,user])


  const active = song?.ownerId === user?.id

  const [deleting, setDeleting] = useState<boolean>(false)

  const deleteSong = async (id: string) => {
    if (user) {
      if (user.id === song?.owner) {
        // console.log(id)
        setDeleting(true)
        try {
          // console.log('hi')
          liked && handleLike(id)
          // console.log('hi')
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
          }
          // console.log('hi')
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
      {(loading || cardItemNameLoading) ? (
        <div className="h-16 mb-1 bg-gray-900 rounded-xl w-full"></div>
      ) : (
        <div className="flex items-center justify-between gap-5 group hover:bg-gray-900 transition-all rounded-xl px-5 py-3">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-5 h-5 flex items-center justify-center opacity-100 transition-all">
              <p className="text-gray-500 text-[13px]">{index}</p>
            </div>
            {/* <button type="button" className="w-5 h-5 group-hover:inline-flex items-center justify-center opacity-0 transition-all group-hover:opacity-100 hidden">
              <Icon icon="line-md:pause-to-play-filled-transition" className="text-xl text-white" />
            </button> */}
            <div className="grid gap-0.5">
              <Link href={`/track/${songId}`} className="text-white text-sm capitalize font-bold transition-all hover:underline focus:underline active:underline truncate">
                {song?.name}
              </Link>
              <Link href={`${active ? '/user' :`/artist/${song?.ownerId}`}`} className="text-gray-500 font-bold text-sm transition-all hover:underline focus:underline active:underline truncate">
                {song?.owner}
              </Link>
            </div>
          </div>
          <p className="hidden md:block md:w-1/5 group-hover:text-white text-gray-500 text-sm font-semibold transition-all truncate capitalize">{song?.genre}</p>
          { song?.createdAt && <p className="hidden md:block md:w-1/5 text-gray-500 text-sm font-semibold transition-all truncate">{formatDistanceToNow(new Date(song?.createdAt))}</p> }
          <div className="flex items-center justify-end gap-5 w-2/5 md:w-1/5">
            <button type="button" disabled={likeLoading} onClick={()=>handleLike(songId)} className="disabled:cursor-not-allowed bg-transparent text-gray-500 hover:text-white focus:text-white active:text-white transition-all md:opacity-0 md:group-hover:opacity-100">
              {likeLoading ? (
                <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
              ) : (
                <>{liked ? <Icon icon="line-md:heart-filled" className="text-xl text-green-500" /> : <Icon icon="line-md:heart" className="text-xl" />}</>
              )}
            </button>
            <p className="text-gray-500 text-[13px] text-right truncate">
              {song?.duration.split(':')[0] !== "00" ? `${song?.duration}` : `${song?.duration.slice(3)}`}
            </p>
            {/* <button type="button" onClick={()=>removeFromPlaylist(songId)} className="text-gray-500 hover:text-white focus:text-white active:text-white transition-all md:opacity-0 md:group-hover:opacity-100">
              <Icon icon="svg-spinners:3-dots-move" className="text-xl" />
            </button> */}
            {user?.id === song?.owner ? (
              <button type="button" disabled={deleting} onClick={()=>deleteSong(songId)} className="disabled:cursor-not-allowed text-gray-500 ml-2 hover:text-white group/btn relative focus:text-white active:text-white transition-all md:opacity-0 md:group-hover:opacity-100">
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
              <button type="button" disabled className="text-gray-500 ml-2 disabled:cursor-not-allowed hover:text-white group/btn relative focus:text-white active:text-white transition-all md:opacity-0 md:group-hover:opacity-100">
                <Icon icon="mdi:delete-empty" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 group-hover/btn:opacity-0 transition-all" />
                <Icon icon="mdi:delete-sweep" className="text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/btn:opacity-100 transition-all" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default CardRowItem