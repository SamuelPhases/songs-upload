"use client"

import { useRecoilValue } from "recoil"
import { Icon } from '@iconify/react';
import Link from "next/link";
import { DocumentData } from "firebase/firestore";

import { sideNavState } from "../state/atoms"
import { LoggedInUserProps, PlaylistsProps } from "../utils"
import SidebarMediaAuthor from "./SidebarMediaAuthor";

type Props = {
    user: LoggedInUserProps | DocumentData,
    closeMobileSideNav?: () => void
}

const SidebarLikedSongs = ({ user, closeMobileSideNav }: Props) => {
    const sideNav = useRecoilValue(sideNavState)

    return (
      <div className="p-2 rounded-xl relative group h-16 w-full flex flex-col gap-2 overflow-hidden hover:bg-gray-900 transition-all cursor-pointer">
        <Link href='/collection/tracks' onClick={closeMobileSideNav} className="absolute inset-0 z-10 bg-transparent hover:bg-[#00000030] focus:bg-[#00000030] active:bg-[#00000030] transition-all"></Link>
        <div className={`h-12 w-12 overflow-hidden mx-auto bg-gradient-to-br from-blue-500 via-purple-400 to-blue-50 rounded hidden lg:hidden md:grid place-items-center`}>
          <Icon icon="line-md:heart-filled" className="text-2xl text-white" />
        </div>
        {!sideNav ? (
          <div className={`h-12 w-12 overflow-hidden mx-auto bg-gradient-to-br from-blue-500 via-purple-400 to-blue-50 rounded hidden md:hidden lg:grid place-items-center`}>
            <Icon icon="line-md:heart-filled" className="text-2xl text-white" />
          </div>
        ) : (
          <div className="flex md:hidden lg:flex items-center gap-4 absolute w-full">
            <div className={`h-12 w-12 overflow-hidden mx-auto bg-gradient-to-br from-blue-500 via-purple-400 to-blue-50 rounded grid place-items-center`}>
                <Icon icon="line-md:heart-filled" className="text-2xl text-white" />
            </div>
            <div className="grid gap-0.5 w-4/5">
                <h4 className="text-base text-white font-semibold line-clamp-1">Liked Songs</h4>
                <div className="flex items-center gap-0.5 text-gray-300/50">
                    <Icon icon="tabler:pin-filled" className="text-green-500" />
                    <p className="font-medium text-sm">Playlist</p>
                    <Icon icon="radix-icons:dot-filled" />
                    <p className="font-medium text-sm truncate">{user?.songs.length} song{user?.songs.length > 1 && 's'}</p>
                </div>
            </div>
          </div>
        )}
      </div>
    )
}

export default SidebarLikedSongs