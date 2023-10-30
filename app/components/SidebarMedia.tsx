"use client"

import { useRecoilValue } from "recoil"
import { Icon } from '@iconify/react';
import Link from "next/link";

import { sideNavState } from "../state/atoms"
import { PlaylistsProps } from "../utils"
import SidebarMediaAuthor from "./SidebarMediaAuthor";
import Image from "next/image";

interface SidebarMediaProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  playlist: PlaylistsProps,
  updatingProfile?: boolean,
  closeMobileSideNav?: () => void
}

export default function SidebarMedia ({ playlist, updatingProfile, closeMobileSideNav, ...props }: SidebarMediaProps) {

  const sideNav = useRecoilValue(sideNavState)

  return (
    <div className="p-2 rounded-xl relative group h-16 w-full flex flex-col gap-2 overflow-hidden hover:bg-gray-900 transition-all cursor-pointer">
      <Link href={`${playlist && `/playlist/${playlist?.id}`}`} onClick={closeMobileSideNav} className="absolute inset-0 z-10 bg-transparent hover:bg-[#00000030] focus:bg-[#00000030] active:bg-[#00000030] transition-all"></Link>
      <div className={`h-12 w-12 overflow-hidden mx-auto bg-gray-700 relative lg:hidden md:grid hidden place-content-center ${playlist ? 'rounded' : 'rounded-full'}`}>
        {playlist?.imgUrl.trim() !== "" ? (
          <Image src={playlist?.imgUrl} alt={`${playlist?.name} image`} layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
        ) : (
          <h2 className="text-gray-200 text-2xl font-bold uppercase">{playlist?.name[0]}</h2>
        )}
      </div>
      {!sideNav ? (
        <div className={`h-12 w-12 overflow-hidden mx-auto bg-gray-700 relative hidden md:hidden lg:grid place-content-center ${playlist ? 'rounded' : 'rounded-full'}`}>
          {playlist?.imgUrl.trim() !== "" ? (
            <Image src={playlist?.imgUrl} alt={`${playlist?.name} image`} layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
          ) : (
            <h2 className="text-gray-200 text-2xl font-bold uppercase">{playlist?.name[0]}</h2>
          )}
        </div>
      ) : (
        <div className="flex md:hidden lg:flex items-center gap-4 absolute w-full">
          <div className={`h-12 w-12 overflow-hidden mx-auto bg-gray-700 relative grid place-content-center ${playlist ? 'rounded' : 'rounded-full'}`}>
            {playlist?.imgUrl.trim() !== "" ? (
              <Image src={playlist?.imgUrl} alt={`${playlist?.name} image`} layout="fill" className="absolute inset-0 object-cover bg-gray-700" />
            ) : (
              <h2 className="text-gray-200 text-2xl font-bold uppercase">{playlist?.name[0]}</h2>
            )}
          </div>
          <div className="grid gap-0.5 w-4/5">
            <h4 className="text-base text-white font-semibold line-clamp-1 capitalize">{playlist?.name}</h4>
            {playlist ? (
              <div className="flex items-center gap-0.5 text-gray-300/50">
                <p className="font-medium text-sm">Playlist</p>
                <Icon icon="radix-icons:dot-filled" />
                <SidebarMediaAuthor owner={playlist?.owner} updatingProfile={updatingProfile} />
              </div>
            ) : (
              <p className="text-gray-300/50 text-sm">Artist</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
