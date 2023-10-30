// import { Icon } from "@iconify/react/dist/iconify.js"
import { Icon } from '@iconify/react';

import Card from "./Card"
import { LoggedInUserProps, PlaylistsProps, SongProps, UserProps } from '../utils';
import Link from 'next/link';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Props = {
  artist?: UserProps,
  playlist?: PlaylistsProps,
  song?: SongProps,
  user: LoggedInUserProps | DocumentData | null
}

const TopResultCard = ({artist, playlist, song, user}: Props) => {

  const active = artist && user?.id === artist?.id
  const [url, setUrl] = useState<string>('/')
  const goForward = () => {
    if (artist) {
      if (active) {
        setUrl(`/user`)
      } else {
        setUrl(`/artist/${artist.id}`)
      }
    } else if (playlist) {
      setUrl(`/playlist/${playlist.id}`)
    } else if (song) {
      setUrl(`/track/${song.id}`)
    }
  }
  useEffect(() => {
    goForward()
    return () => goForward()
  },[artist, playlist, song, user])

  return (
    <Card className="px-3 flex flex-col justify-between h-56">
        <Link href={url} className="p-3 bg-transparent absolute inset-0 rounded-lg before:absolute before:w-0 before:h-0 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[#00000030] active:before:w-full focus:before:w-full hover:before:w-full active:before:h-full focus:before:h-full hover:before:h-full group/tab-active:before:w-full group/tab-focus:before:w-full group/tab-hover:before:w-full group/tab-active:before:h-full group/tab-focus:before:h-full group/tab-hover:before:h-full before:origin-center transition-all before:transition-all"></Link>
        <div className="w-24 h-24 rounded-full bg-gray-700 relative overflow-hidden grid place-content-center">
          {artist && artist.displayPicture.trim() !== "" ? (
            <div className="absolute inset-0 cursor-pointer transition-all">
              <Image src={artist?.displayPicture} alt="Selected file" layout="fill" className="absolute inset-0 object-cover" />
            </div>
          ) : (
            <h2 className="text-7xl uppercase text-gray-200 font-bold">{artist?.userName[0]}</h2>
          )}
          {song && song.imgUrl.trim() !== "" ? (
            <div className="absolute inset-0 cursor-pointer transition-all">
              <Image src={song?.imgUrl} alt="Selected file" layout="fill" className="absolute inset-0 object-cover" />
            </div>
          ) : (
            <h2 className="text-7xl uppercase text-gray-200 font-bold">{song?.name[0]}</h2>
          )}
          {playlist && playlist.imgUrl.trim() !== "" ? (
            <div className="absolute inset-0 cursor-pointer transition-all">
              <Image src={playlist?.imgUrl} alt="Selected file" layout="fill" className="absolute inset-0 object-cover" />
            </div>
          ) : (
            <h2 className="text-7xl uppercase text-gray-200 font-bold">{playlist?.name[0]}</h2>
          )}
        </div>
        <h2 className="text-4xl font-extrabold text-white truncate capitalize">{artist?.userName || playlist?.name || song?.name}</h2>
        <p className="text-sm w-fit px-4 py-1.5 font-medium rounded-xl bg-black">
          {artist && 'Artist'}
          {playlist && 'Playlist'}
          {song && 'Song'}
        </p>
        <Link href={url} className="w-14 h-14 flex items-center justify-center bg-green-500 z-10 text-white border-2 border-green-500 hover:text-green-500 focus:text-green-500 active:text-green-500 hover:bg-transparent focus:bg-transparent active:bg-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 absolute bottom-0 right-5 rounded-full group-hover:bottom-10 group-focus:bottom-10 group-active:bottom-10 transition-all">
          {!artist ? <Icon icon="solar:play-bold" className="text-3xl" /> : <Icon icon="line-md:watch-twotone-loop" className="text-3xl" />}
        </Link>
    </Card>
  )
}

export default TopResultCard