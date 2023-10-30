// import { Icon } from "@iconify/react/dist/iconify.js"
import { Icon } from '@iconify/react';
import Link from "next/link"
import { LoggedInUserProps, SongProps } from '../utils';
import { DocumentData, arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { db } from '@/firebase';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SetterOrUpdater } from 'recoil';
import SongsRowSearchName from './SongsRowSearchName';

type Props = {
    song: SongProps,
    likeLoading: boolean,
    user: LoggedInUserProps | DocumentData | null,
    setLikeLoading: SetterOrUpdater<boolean>,
    setUser:  SetterOrUpdater<LoggedInUserProps | DocumentData | null>,
}

const SongsRowSearch = ({ song, user, likeLoading, setLikeLoading, setUser }: Props) => {

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
    <div className="w-full flex items-center justify-between gap-5 relative group hover:bg-gray-900 p-2.5 rounded-md">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 relative overflow-hidden grid place-content-center">
                {song && song.imgUrl.trim() !== "" ? (
                  <div className="absolute inset-0 cursor-pointer transition-all">
                    <Image src={song?.imgUrl} alt="Selected file" layout="fill" className="absolute inset-0 object-cover" />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-gray-200 uppercase">{song?.name[0]}</h2>
                )}
                <button type="button" className="absolute inset-0 bg-green-300 flex items-center justify-center group-hover:bg-[#00000040] text-white opacity-0 transition-all group-hover:opacity-100">
                    <Icon icon="solar:play-bold" />
                </button>
            </div>
            <div className="flex flex-col gap-0.5">
                <Link href={`/track/${song?.id}`} className="text-sm text-white font-semibold transition hover:underline focus:underline active:underline capitalize">{song?.name}</Link>
                {song && <SongsRowSearchName owner={song.owner} user={user} />}
            </div>
        </div>
        <div className="flex items-center gap-3">
            <button type="button" disabled={likeLoading} onClick={()=>handleLike(song?.id)} className="disabled:cursor-not-allowed text-gray-500 hover:text-white focus:text-white active:text-white transition-all opacity-0 group-hover:opacity-100">
                {likeLoading ? (
                    <Icon icon="svg-spinners:eclipse-half" className="text-xl" />
                ) : (
                    <>{liked ? <Icon icon="line-md:heart-filled" className="text-xl text-green-500" /> : <Icon icon="line-md:heart" className="text-xl" />}</>
                )}
            </button>
            <p className="text-gray-400/50 text-[13px]">
                {song?.duration.split(':')[0] !== "00" ? `${song?.duration}` : `${song?.duration.slice(3)}`}
            </p>
            {/* <button type="button" className="text-gray-500 hover:text-white focus:text-white active:text-white transition-all opacity-0 group-hover:opacity-100">
                <Icon icon="svg-spinners:3-dots-move" className="text-xl" />
            </button> */}
        </div>
    </div>
  )
}

export default SongsRowSearch