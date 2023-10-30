import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { SetterOrUpdater, useSetRecoilState } from 'recoil'
import { DocumentData, doc, getDoc } from 'firebase/firestore'

import { CurrentSongProps, LoggedInUserProps, SongProps } from '../utils'
import CardInfoName from './CardInfoName'
import { viewTrack } from '../state/atoms'
import { db } from '@/firebase'

type Props = {
    id: string,
    setTrack: SetterOrUpdater<SongProps | DocumentData | null>,
    user?: LoggedInUserProps | DocumentData | null,
    setCurrentSong: SetterOrUpdater<CurrentSongProps | null>,
}

const RecentlyPlayedCard = ({ id, setTrack, user, setCurrentSong }: Props) => {

    const router = useRouter()
    const [song, setSong] = useState<SongProps | DocumentData | null>(null)
      
    useEffect(() => {
        const getSongData = async (id: string) => {
          const docRef = doc(db, "songs", id);
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const userRef = doc(db, "users", docSnap.data().owner);
            const userRefSnap = await getDoc(userRef)
            if (userRefSnap.exists()) {
              setSong({
                ...docSnap.data(),
                ownerId: docSnap.data().owner,
                owner: `${userRefSnap.data().userName}`
              })
            } else {
              setSong(null)
            }
            // setSong(docSnap.data())
          } else {
            setSong(null)
          }
        }
        getSongData(id)
    },[id,setSong])
    const chooseSong = (song: SongProps | DocumentData | null) => {
      setCurrentSong({ playlist: [], playlistTitle: "", playlistSongOwners: [], song: song, play: true })
      setTrack(song)
      router.push(`/track/${id}`)
    }
    const active = song?.ownerId === user?.id
  
  return (
    <div className="rounded-lg group relative h-52 lg:h-56 xl:h-60 w-full flex flex-col items-center p-3">
      <button type="button" className="absolute inset-0 h-full w-full rounded-lg bg-gray-900 group-hover:bg-gray-800/50 hover:bg-gray-800/50 focus:bg-gray-800/50 active:bg-gray-800/50 flex flex-col gap-3 text-left"></button>
      <button type="button" onClick={()=>chooseSong(song)} className="z-10 w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-green-500 text-white transition-all flex items-center justify-center absolute right-3 bottom-0 opacity-0 active:opacity-100 group-hover:opacity-100 focus:opacity-100 active:bottom-20 group-hover:bottom-20 focus:bottom-20 hover:bg-transparent border-2 border-green-500 hover:text-green-500">
        <Icon icon="line-md:pause-to-play-filled-transition" className="text-5xl xl:text-7xl" />
      </button>
      <div className="absolute w-full px-3 flex flex-col gap-2">
        <div className="h-32 lg:h-36 w-full bg-gray-700 rounded-lg overflow-hidden shadow-2xl group-hover:shadow-gray-900/50 group-focus:shadow-gray-900/50 group-active:shadow-gray-900/50 relative grid place-content-center">
          {song && song?.imgUrl.trim() !== "" ? (
            <Image src={song?.imgUrl} alt={`${song?.name} image`} layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
          ) : (
            <h2 className="text-8xl font-bold uppercase text-gray-300">{song?.name[0]}</h2>
          )}
        </div>
        <Link href={`/track/${id}`} className="text-white font-semibold text-base capitalize line-clamp-1 transition-all focus:underline hover:underline">{song?.name}</Link>
        <Link href={`${active ? '/user' : `/artist/${song?.ownerId}`}`} className="line-clamp-1 text-sm font-bold text-gray-500 transition-all hover:text-white focus:text-white"> By {song?.owner}</Link>
      </div>
    </div>
  )
}

export default RecentlyPlayedCard