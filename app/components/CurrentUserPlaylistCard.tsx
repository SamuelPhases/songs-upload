import Link from 'next/link'
import { Icon } from '@iconify/react'
import { CurrentSongProps, LoggedInUserProps, PlaylistsProps, SongProps } from '../utils'
import PlaylistCardInfo from './PlaylistCardInfo'
import Image from 'next/image'
import { DocumentData, doc, getDoc } from 'firebase/firestore'
import { SetterOrUpdater, useSetRecoilState } from 'recoil'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { db } from '@/firebase'
import { id } from 'date-fns/locale'
import { currentPlaying } from '../state/atoms'


interface PlaylistCardProps {
  playlist: PlaylistsProps,
  // user: LoggedInUserProps | DocumentData,
  // setTrack: SetterOrUpdater<SongProps | DocumentData | null>,
  setCurrentSong: SetterOrUpdater<CurrentSongProps | null>,
}

// const CurrentUserPlaylistCard = ({ playlist, user, setTrack, setCurrentSong }: PlaylistCardProps) => {
const CurrentUserPlaylistCard = ({ playlist,  setCurrentSong }: PlaylistCardProps) => {

  // const setCurrentSong = useSetRecoilState(currentPlaying)

  const router = useRouter()
  const choosePlaylist = async (playlist: PlaylistsProps) => {
    setCurrentSong({playlist: [], playlistTitle: "", playlistSongOwners: [], song: null, play: false})
    // console.log('hello')
    try {
      if (playlist) {
        const docRef = doc(db, "playlists", playlist.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const ids = docSnap.data().songs
          const getData = async (ids: string[]) => {
            const infoPromises = ids.map( async (id: string) => {
              try {
                const info = await getDoc(doc(db, "songs", id))
                if (info.exists()) {
                  const data = info.data()
                  return data
                } else {
                  toast.error('One of the songs in this playlist has been deleted')
                }
              } catch (error: any) {
                toast.error(error.message)
              }
            })
            const result = await Promise.all(infoPromises)
            return result
          } 
          try {
            const res = await getData(ids)
            const resIds = res.map((song: DocumentData | undefined | SongProps) => song?.owner)
            const getOwners = async (list: string[]) => {
              const getUsers = list.map( async (item: string) => {
                try {
                  const info = await getDoc(doc(db, "users", item))
                  if (info.exists()) {
                    const data = info.data().userName
                    return data
                  } else {
                    toast.error('One of the songs in this playlist has been deleted')
                  }
                } catch (error: any) {
                  toast.error(error.message)
                }
              })
              const names = await Promise.all(getUsers)
              return names
            }
            try {
              const nameList = await getOwners(resIds)
              // if (res) {
              // }
              setCurrentSong({
                // playlist: res,
                playlist: res as (SongProps | DocumentData)[],
                playlistTitle: docSnap.data().name,
                playlistSongOwners: nameList,
                song: null,
                play: false,
              })
            } catch (error: any) {
              toast.error(error.message)
              setCurrentSong({
                // playlist: res,
                playlist: res as (SongProps | DocumentData)[],
                playlistTitle: docSnap.data().name,
                playlistSongOwners: [],
                song: null,
                play: false,
              })
            }
          } catch (error) {
            toast.error('Something went wrong')
          }
        } else {
          setCurrentSong({playlist: [], playlistTitle: "", playlistSongOwners: [], song: null, play: false})
        }
        router.push(`/playlist/${playlist.id}`)
      }
    } catch (error) {
      toast.error('Sorry something went wrong')
    }
  }

  return (
    <Link href={`/playlist/${playlist?.id}`} className="rounded-lg group relative h-52 lg:h-56 xl:h-60 w-full flex flex-col items-center p-3">
      <button type="button" className="absolute inset-0 h-full w-full rounded-lg bg-gray-900 group-hover:bg-gray-800/50 hover:bg-gray-800/50 focus:bg-gray-800/50 active:bg-gray-800/50 flex flex-col gap-3 text-left"></button>
      <button type="button" onClick={()=>choosePlaylist(playlist)} className="z-10 w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-green-500 text-white transition-all flex items-center justify-center absolute right-3 bottom-0 opacity-0 active:opacity-100 group-hover:opacity-100 focus:opacity-100 active:bottom-20 group-hover:bottom-20 focus:bottom-20 hover:bg-transparent border-2 border-green-500 hover:text-green-500">
        <Icon icon="line-md:pause-to-play-filled-transition" className="text-5xl xl:text-7xl" />
      </button>
      <div className="absolute w-full px-3 flex flex-col gap-1 md:gap-2">
        {/* <div className="h-32 md:h-44 lg:h-40 w-[95%] mx-auto bg-gray-700 rounded-lg overflow-hidden shadow-2xl group-hover:shadow-gray-700 group-focus:shadow-gray-700 group-active:shadow-gray-700 relative grid place-content-center"> */}
        <div className="h-32 lg:h-36 w-full mx-auto bg-gray-700 rounded-lg overflow-hidden shadow-2xl group-hover:shadow-gray-700 group-focus:shadow-gray-700 group-active:shadow-gray-700 relative grid place-content-center">
          {playlist && playlist.imgUrl.trim() !== "" ? (
            <Image src={playlist.imgUrl} alt={`${playlist.name} image`} layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
          ) : (
            <h2 className="text-8xl font-bold uppercase text-gray-300">{playlist?.name[0]}</h2>
          )}
        </div>
        <h4 className="text-white font-extrabold text-sm md:text-base line-clamp-1 capitalize">{playlist?.name}</h4>
        <PlaylistCardInfo owner={playlist?.owner} />
        {/* {user?.userName ? (
          <p className="line-clamp-2 text-[13px] md:text-sm font-bold text-gray-500"> By {user?.userName}</p>
        ) : (
        )} */}
      </div>
    </Link>
  )
}

export default CurrentUserPlaylistCard